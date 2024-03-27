package com.ll.everycharge.domain.charger.update.charger.scheduler;

import java.time.LocalDateTime;

import org.springframework.context.annotation.Profile;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.ll.everycharge.domain.charger.charger.service.ChargerService;
import com.ll.everycharge.domain.charger.update.charger.batch.config.ChargerBatchUpdateConfig;
import com.ll.everycharge.domain.charger.update.charger.batch.service.ChargerBatchUpdateService;
import com.ll.everycharge.domain.charger.update.chargerState.service.ChargerStateUpdateConfig;
import com.ll.everycharge.domain.charger.update.chargerState.service.ChargerStateUpdateService;
import com.ll.everycharge.global.app.AppConfig;
import com.ll.everycharge.standard.util.Ut;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
@Profile("prod")
@RequiredArgsConstructor
public class ChargerBatchUpdateScheduler {
	private final ChargerBatchUpdateService chargerBatchUpdateService;
	private final ChargerStateUpdateService chargerStateUpdateService;
	private final ChargerBatchUpdateConfig chargerBatchUpdateConfig;
	private final ChargerStateUpdateConfig chargerStateUpdateConfig;
	private final ChargerService chargerService;

	@Scheduled(cron = "0 3 30 * * *") // 운영용
	public void chargerBatchUpdateScheduled() {
		while (!AppConfig.isAppInitialized || chargerStateUpdateConfig.isUpdateRunning()) {
			try {
				Thread.sleep(1000);
				log.info("[Scheduler] : 데이터 배치 전역 업데이트 대기중");
			} catch (InterruptedException e) {
				log.error("[ERROR] : 데이터 배치 전역 업데이트 대기중 스레드 오류, 스레드 재설정");
				Thread.currentThread().interrupt();
			}
		}
		chargerBatchUpdateConfig.setBatchUpdateRunning(true);
		log.info("[Scheduler] : 데이터 배치 전역 업데이트 시작");
		LocalDateTime startTime = LocalDateTime.now();

		// 배치 업데이트
		chargerBatchUpdateService.runChargerBatchUpdateJob();
		// delYn(충전기 삭제 여부) Y인 충전기 모두 삭제
		chargerService.deleteAllDeletedChargers();
		// redis flush
		chargerStateUpdateService.flushAllRedisData();

		chargerBatchUpdateConfig.setBatchUpdateRunning(false);
		LocalDateTime endTime = LocalDateTime.now();
		log.info("[Scheduler] : 데이터 배치 전역 업데이트 완료 : 메소드 실행시간 {}", Ut.calcDuration(startTime, endTime));
		Ut.calcHeapMemory();
	}
}

