package com.ll.eitcharge.domain.charger.update.charger.scheduler;

import java.time.LocalDateTime;

import org.springframework.context.annotation.Profile;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.ll.eitcharge.domain.charger.update.charger.batch.config.ChargerBatchUpdateConfig;
import com.ll.eitcharge.domain.charger.update.charger.batch.service.ChargerBatchUpdateService;
import com.ll.eitcharge.domain.charger.update.chargerState.service.ChargerStateUpdateConfig;
import com.ll.eitcharge.global.app.AppConfig;
import com.ll.eitcharge.standard.util.Ut;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
@Profile("dev")
@RequiredArgsConstructor
public class ChargerBatchUpdateScheduler {

	private final ChargerBatchUpdateService chargerBatchUpdateService;

	// @Scheduled(cron = "0 0 3 * * *") // 운영용
	@Scheduled(fixedRate = 3 * 60 * 1000) // 개발용
	public void updateChargerScheduled() {
		while (!AppConfig.isAppInitialized || ChargerStateUpdateConfig.isUpdateRunning) {
			try {
				Thread.sleep(1000);
			} catch (InterruptedException e) {
				log.info("[System] : 충전기 전역 업데이트 대기중 스레드 오류, 스레드 재설정");
				Thread.currentThread().interrupt();
			}
		}
		ChargerBatchUpdateConfig.isBatchUpdateRunning = true;
		log.info("[Scheduler] : 충전기 상태 업데이트 시작");
		LocalDateTime startTime = LocalDateTime.now();

		chargerBatchUpdateService.updateCharger();

		ChargerBatchUpdateConfig.isBatchUpdateRunning = false;
		LocalDateTime endTime = LocalDateTime.now();
		log.info("[Scheduler] : 충전기 전역 업데이트 종료 : 메소드 실행시간 {}", Ut.calcDuration(startTime, endTime));
		Ut.calcHeapMemory();
	}
}

