package com.ll.eitcharge.domain.charger.update.chargerState.service;

import static com.ll.eitcharge.global.app.AppConfig.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.atomic.AtomicInteger;

import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ll.eitcharge.domain.charger.charger.repository.ChargerRepository;
import com.ll.eitcharge.domain.charger.charger.service.ChargerService;
import com.ll.eitcharge.domain.charger.charger.form.ChargerStateUpdateForm;
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
	private final ChargerRepository chargerRepository;

	public void flushAllRedisData() {
		chargerStateRedisService.flushAll();
	}

	/**
	 * 충전기 상태 업데이트
	 * Async O, Redis X
	 */
	@Async
	@Transactional
	public void updateChargerState1(String baseUrl, String contentType, int numOfRows, int pageNo, int priod) {
		log.info("[OpenAPI] : OpenAPI 데이터 불러오기 시작");

		HashMap apiDataMap = chargerService.webClientApiGetChargerStatus(
			baseUrl, apiServiceKey, numOfRows, pageNo, contentType, priod);
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");

		List<Map<String, Object>> items =
			(List<Map<String, Object>>)((Map<String, Object>)apiDataMap.get("items")).get("item");

		if (!items.isEmpty()) {
			log.info("[OpenAPI] : OpenAPI 데이터 {}건 불러오기 완료", items.size());
		}

		List<ChargerStateUpdateForm> apiChargerList =
			items.stream().map(item -> {
				String statId = (String)item.get("statId");
				String chgerId = String.valueOf(Integer.parseInt((String)item.get("chgerId"))); // 0 절삭
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

				return new ChargerStateUpdateForm(statId, chgerId, stat, statUpdDt, lastTsdt, lastTedt, nowTsdt);
			}).toList();

		// DB 업데이트 로직 단건 업데이트
		AtomicInteger successCnt = new AtomicInteger();
		apiChargerList.forEach(charger -> {
			int isUpdated = chargerRepository.updateChargerState(charger);
			if (isUpdated == 1)
				successCnt.getAndIncrement();
		});
		log.info("[DB] : 충전기 상태 {}건 중 {}건 업데이트 완료", apiChargerList.size(), successCnt);
	}

	/**
	 * 충전기 상태 업데이트
	 * Async O, Redis O
	 */
	@Async
	@Transactional
	public void updateChargerState2(String baseUrl, String contentType, int numOfRows, int pageNo, int period) {
		log.info("[OpenAPI] : OpenAPI 데이터 불러오기 시작");

		HashMap apiDataMap = chargerService.webClientApiGetChargerStatus(
			baseUrl, apiServiceKey, numOfRows, pageNo, contentType, period);
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");

		List<Map<String, Object>> items =
			(List<Map<String, Object>>)((Map<String, Object>)apiDataMap.get("items")).get("item");

		if (!items.isEmpty()) {
			log.info("[OpenAPI] : OpenAPI 데이터 {}건 불러오기 완료", items.size());
		}
    
    // 레디스와 비교할 오픈 API의 전체 데이터를 담을 리스트 선언
		List<ChargerStateUpdateForm> apiChargerList =
			items.stream().map(item -> {
				String statId = (String)item.get("statId");
				String chgerId = String.valueOf(Integer.parseInt((String)item.get("chgerId"))); // 0 절삭
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

				return new ChargerStateUpdateForm(statId, chgerId, stat, statUpdDt, lastTsdt, lastTedt, nowTsdt);
			}).toList();

		// 레디스 비교를 통해 DB상 없는 충전기를 1차 필터링
		List<ChargerStateUpdateForm> filteredChargerList =
			chargerStateRedisService.filterExistingChargersFromRedis(apiChargerList);

		// DB 저장
		AtomicInteger successCnt = new AtomicInteger();
		Set<String> nonExistingChargerKeySet = new HashSet<>();
		LocalDateTime dbStartTime = LocalDateTime.now();

		filteredChargerList.forEach(charger -> {
			int isUpdated = chargerRepository.updateChargerState(charger);

			if (isUpdated == 1)
				successCnt.getAndIncrement();

			if (isUpdated == 0) {
				nonExistingChargerKeySet.add(String.format("%s_%s", charger.getStatId(), charger.getChgerId()));
			}
		});

		LocalDateTime dbEndTime = LocalDateTime.now();
		log.info("[DB] : 충전기 상태 {}건 중 {}건 업데이트 완료, {}건 DB 미등록 데이터",
			filteredChargerList.size(), successCnt, nonExistingChargerKeySet.size()
		);
		log.info("[DB] : 충전기 상태 갱신 시간 : {}", Ut.calcDuration(dbStartTime, dbEndTime));

		// DB 비교 후 없는 충전기 정보를 Redis에 저장
		chargerStateRedisService.updateNonExistingChargersToRedis(nonExistingChargerKeySet);
	}
}


