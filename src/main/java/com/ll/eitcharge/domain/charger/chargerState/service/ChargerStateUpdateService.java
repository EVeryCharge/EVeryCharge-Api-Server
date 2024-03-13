package com.ll.eitcharge.domain.charger.chargerState.service;

import static com.ll.eitcharge.global.app.AppConfig.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ll.eitcharge.domain.charger.charger.repository.ChargerRepository;
import com.ll.eitcharge.domain.charger.charger.service.ChargerService;
import com.ll.eitcharge.domain.charger.chargerState.form.ChargerStateUpdateForm;
import com.ll.eitcharge.domain.charger.chargerState.repository.ChargerStateBulkUpdateRepository;
import com.ll.eitcharge.standard.util.Ut;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ChargerStateUpdateService {
	private final ChargerService chargerService;
	private final ChargerStateRedisService chargerStateRedisService;
	private final ChargerStateUpdateRepository chargerStateUpdateRepository;

	public void updateChargerStateScheduled() {
		updateChargerState();
	}

	public void initChargersToRedis() {
		LocalDateTime startTime = LocalDateTime.now();
		log.info("[REDIS](init) : 시작");

		chargerStateRedisService.flushAll();
		chargerStateRedisService.setChargersToRedisByChargingStationList(chargerService.findAll());

		LocalDateTime endTime = LocalDateTime.now();
		log.info("[REDIS](init) : 종료, 메소드 실행시간 {}", Ut.calcDuration(startTime, endTime));
	}

	@Async
	@Transactional
	public void updateChargerState() {
		log.info("충전기 상태 업데이트 시작");
		LocalDateTime startTime = LocalDateTime.now();

		//현재는 해당 api의 응답데이터가 10000개를 넘는일은 없을것으로 예상.
		//하지만 추후에 10000개 이상일경우, 리팩토링 필요함
		String key = apiServiceKey;
		String baseUrl = "https://apis.data.go.kr/B552584/EvCharger/getChargerStatus";
		String jsonType = "JSON";
		int numOfRows = 10000;
		int pageNo = 1;
		int priod = 10;

		HashMap apiDataMap = chargerService.webClientApiGetChargerStatus(
			baseUrl, key, numOfRows, pageNo, jsonType, priod);
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");

		// 레디스와 비교할 오픈 API의 전체 데이터를 담을 리스트 선언
		List<ChargerStateUpdateForm> apiChargersDtoList = new ArrayList<>();
		List<Map<String, Object>> items =
			(List<Map<String, Object>>)((Map<String, Object>)apiDataMap.get("items")).get("item");

		for (Map<String, Object> item : items) {
			String statId = (String)item.get("statId");
			String chgerId = (String)item.get("chgerId");
			String stat = (String)item.get("stat");

			LocalDateTime statUpdDt = Optional.ofNullable((String)item.get("statUpdDt"))
				.filter(s -> !s.isEmpty())
				.map(s -> LocalDateTime.parse(s, formatter))
				.orElse(null);
			LocalDateTime lastTsdt = Optional.ofNullable((String)item.get("lastTsdt"))
				.filter(s -> !s.isEmpty())
				.map(s -> LocalDateTime.parse(s, formatter))
				.orElse(null);
			LocalDateTime lastTedt = Optional.ofNullable((String)item.get("lastTedt"))
				.filter(s -> !s.isEmpty())
				.map(s -> LocalDateTime.parse(s, formatter))
				.orElse(null);
			LocalDateTime nowTsdt = Optional.ofNullable((String)item.get("nowTsdt"))
				.filter(s -> !s.isEmpty())
				.map(s -> LocalDateTime.parse(s, formatter))
				.orElse(null);

			apiChargersDtoList.add(
				new ChargerStateUpdateDto(statId, chgerId, stat, statUpdDt, lastTsdt, lastTedt, nowTsdt));
		}

		// 레디스 비교를 통해 충전기 상태가 갱신된 충전기 리스트 반환
		List<ChargerStateUpdateDto> updatedChargersDtoList =
			chargerStateRedisService.updateExistingChargersToRedis(apiChargersDtoList);

		// DB 업데이트 로직 1. 단건 업데이트
		updatedChargersDtoList.forEach(chargerRepository::updateChargerState);
		log.info("[DB] : 충전기 상태 {}건 업데이트 완료", updatedChargersDtoList.size());

		// DB 업데이트 로직 2. 네이티브 쿼리를 활용한 bulk update 로직 (unused)
		// chargerStateUpdateRepository.bulkUpdateChargerState(updatedChargersDtoList);

		// DB 업데이트 로직 3. 조회는 하되 저장은 한번에 JPA saveAll
		//

		// DB 업데이트 로직 4. JPA 기반 단건 업데이트 로직(기존)
		// chargingStationRepository.findById(statId)
		// 	//충전소가 존재할때
		// 	.map(chargingStation -> {
		//
		// 		return chargerRepository.findByChargingStationStatIdAndChgerId(statId,chgerId)
		// 			//해당 충전소의 충전기가 존재할때
		// 			.map(charger -> {
		// 				charger.toBuilder()
		// 					.stat(stat)
		// 					.statUpdDt(statUpdDt)
		// 					.lastTsdt(lastTsdt)
		// 					.lastTedt(lastTedt)
		// 					.nowTsdt(nowTsdt)
		// 					.build();
		// 				System.out.println("충전소 업데이트 성공 1-1");
		// 				return chargerRepository.save(charger);
		// 			})
		// 			.orElseGet(() -> {
		// 				//해당 충전소의 충전기가 존재하지 않을때
		// 				// 새 충전기 생성 후 저장
		// 				Charger charger = Charger.builder()
		// 					.chargingStation(chargingStation)
		// 					.stat(stat)
		// 					.chgerId(chgerId)
		// 					.statUpdDt(statUpdDt)
		// 					.lastTsdt(lastTsdt)
		// 					.lastTedt(lastTedt)
		// 					.nowTsdt(nowTsdt)
		// 					.build();
		// 				// 파일에 로그 메시지를 저장
		// 				// 아마 기존의 충전소에 새롭게 충전기가 설치될경우 이 로직을 타게될듯
		// 				// 해당 파일은 배치를 통해 api요청으로
		// 				String logMessage = charger.getChargingStation().getStatId() + "," + charger.getChgerId() + "," + charger.getStat();
		// 				try (BufferedWriter writer = new BufferedWriter(new FileWriter("batch/NoCharger.txt", true))) {
		// 					writer.write(logMessage);
		// 					writer.newLine();
		// 				} catch (IOException e) {
		// 					// 파일 쓰기 실패 시 예외 처리
		// 					e.printStackTrace();
		// 				}
		// 				System.out.println("충전소 업데이트 성공 1-2");
		// 				return chargerRepository.save(charger);
		// 			});
		// 	})
		// 	//충전소가 존재하지 않을때
		// 	.orElseGet(()->{
		// 			String logMessage = statId;
		// 			try (BufferedWriter writer = new BufferedWriter(new FileWriter("batch/NoChargingStation.txt", true))) {
		// 				writer.write(logMessage);
		// 				writer.newLine();
		// 			} catch (IOException e) {
		// 				// 파일 쓰기 실패 시 예외 처리
		// 				e.printStackTrace();
		// 			}
		// 			return null;
		// 		}
		// 	);

		LocalDateTime endTime = LocalDateTime.now();
		log.info("충전기 상태 업데이트 종료 : 메소드 실행시간 {}", Ut.calcDuration(startTime, endTime));
	}
}


