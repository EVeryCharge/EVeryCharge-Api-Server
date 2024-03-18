package com.ll.eitcharge.domain.charger.update.chargerState.scheduler;

import java.time.LocalDateTime;

import org.springframework.context.annotation.Profile;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.ll.eitcharge.domain.charger.update.charger.batch.config.ChargerBatchUpdateConfig;
import com.ll.eitcharge.domain.charger.update.chargerState.service.ChargerStateUpdateConfig;
import com.ll.eitcharge.domain.charger.update.chargerState.service.ChargerStateUpdateService;
import com.ll.eitcharge.global.app.AppConfig;
import com.ll.eitcharge.standard.util.Ut;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@Profile("dev")
@Slf4j
@RequiredArgsConstructor
public class ChargerStateUpdateScheduler {

	private final ChargerStateUpdateService chargerStatusUpdateService;
	private final ChargerStateUpdateConfig chargerStateUpdateConfig;
	private final ChargerBatchUpdateConfig chargerBatchUpdateConfig;

	@Scheduled(fixedRate = 3 * 60 * 1000) // 초기 지연 시간 5분, 그 후 3분마다 실행
	public void updateChargerStateScheduled() {
		if (!AppConfig.isAppInitialized || chargerBatchUpdateConfig.isBatchUpdateRunning()) return;

		chargerStateUpdateConfig.setUpdateRunning(true);
		log.info("[Scheduler] : 충전기 상태 업데이트 시작");
		LocalDateTime startTime = LocalDateTime.now();

		chargerStatusUpdateService.updateChargerState2(
			chargerStateUpdateConfig.getBaseUrl(),
			chargerStateUpdateConfig.getContentType(),
            chargerStateUpdateConfig.getNumOfRows(),
            chargerStateUpdateConfig.getPageNo(),
            chargerStateUpdateConfig.getPeriod()
		);

		chargerStateUpdateConfig.setUpdateRunning(false);
		LocalDateTime endTime = LocalDateTime.now();
		log.info("[Scheduler] : 충전기 상태 업데이트 종료 : 메소드 실행시간 {}", Ut.calcDuration(startTime, endTime));
		Ut.calcHeapMemory();
	}
}