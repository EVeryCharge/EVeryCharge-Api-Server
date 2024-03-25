// package com.ll.eitcharge.domain.charger.update.charger.batch.writer;
//
// import java.util.ArrayList;
// import java.util.List;
// import java.util.Optional;
//
// import org.springframework.batch.core.configuration.annotation.StepScope;
// import org.springframework.batch.item.Chunk;
// import org.springframework.batch.item.ItemWriter;
// import org.springframework.stereotype.Component;
//
// import com.ll.eitcharge.domain.charger.charger.entity.Charger;
// import com.ll.eitcharge.domain.charger.charger.form.ChargerUpdateForm;
// import com.ll.eitcharge.domain.charger.charger.repository.ChargerRepository;
// import com.ll.eitcharge.domain.chargingStation.chargingStation.entity.ChargingStation;
// import com.ll.eitcharge.domain.chargingStation.chargingStation.repository.ChargingStationRepository;
//
// import lombok.RequiredArgsConstructor;
// import lombok.extern.slf4j.Slf4j;
//
// @Component
// @StepScope
// @RequiredArgsConstructor
// @Slf4j
// public class ChargerBatchWriter implements ItemWriter<List<ChargerUpdateForm>> {
// 	private final ChargingStationRepository stationRepository;
// 	private final ChargerRepository chargerRepository;
//
// 	@Override
// 	public void write(Chunk<? extends List<ChargerUpdateForm>> chunk) {
// 		log.info("[ChargerBatchWriter] : 실행");
// 		int insertCount = 0;
// 		int updateCount = 0;
// 		int execCount = 0;
//
// 		try {
// 			for (List<ChargerUpdateForm> items : chunk) {
// 				List<Charger> execList = new ArrayList<>();
//
// 				for (ChargerUpdateForm item : items) {
// 					Charger charger;
// 					ChargingStation station = stationRepository.findById(item.getStatId()).get();
//
// 					Optional<Charger> opCharger
// 						= chargerRepository.findByChargingStationAndChgerId(station, item.getChgerId());
// 					if (opCharger.isEmpty()) {
// 						charger = new Charger(item, station);
// 						insertCount++;
// 						// save
// 					} else {
// 						charger = opCharger.get();
// 						charger.update(item, station);
// 						updateCount++;
// 					}
// 					execList.add(charger);
// 				}
// 				chargerRepository.saveAll(execList);
// 				// 업데이트는 벌크로 처리될 수 있게끔
// 				execCount += execList.size();
// 			}
// 			log.info("[Batch] : 충전기 데이터 {}건 중 신규 충전기 {}건 추가, 기존 충전기 {}건 업데이트 완료"
// 				, execCount, insertCount, updateCount);
// 		} catch (Exception e) {
// 			log.error("[ChargerBatchWriter] : 오류 발생, 오류 원인 : {}", e.getMessage());
// 			e.printStackTrace();
// 		}
// 	}
// }
