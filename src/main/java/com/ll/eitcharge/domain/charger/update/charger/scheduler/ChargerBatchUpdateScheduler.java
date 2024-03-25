package com.ll.eitcharge.domain.charger.update.charger.scheduler;

import java.time.LocalDateTime;

import org.springframework.context.annotation.Profile;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.ll.eitcharge.domain.charger.charger.service.ChargerService;
import com.ll.eitcharge.domain.charger.update.charger.batch.config.ChargerBatchUpdateConfig;
import com.ll.eitcharge.domain.charger.update.charger.batch.service.ChargerBatchUpdateService;
import com.ll.eitcharge.domain.charger.update.chargerState.service.ChargerStateUpdateConfig;
import com.ll.eitcharge.global.app.AppConfig;
import com.ll.eitcharge.standard.util.Ut;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
@Profile("prod")
@RequiredArgsConstructor
public class ChargerBatchUpdateScheduler {
	private final ChargerBatchUpdateService chargerBatchUpdateService;
	private final ChargerBatchUpdateConfig chargerBatchUpdateConfig;
	private final ChargerStateUpdateConfig chargerStateUpdateConfig;
	private final ChargerService chargerService;

	@Scheduled(cron = "0 15 14 * * *") // 운영용
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

		chargerBatchUpdateService.runChargerBatchUpdateJob();
		chargerService.deleteAllDeletedChargers();

		chargerBatchUpdateConfig.setBatchUpdateRunning(false);
		LocalDateTime endTime = LocalDateTime.now();
		log.info("[Scheduler] : 데이터 배치 전역 업데이트 종료 : 메소드 실행시간 {}", Ut.calcDuration(startTime, endTime));
		Ut.calcHeapMemory();
	}
}

