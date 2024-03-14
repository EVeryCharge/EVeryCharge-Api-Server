package com.ll.eitcharge.domain.charger.chargerState.scheduler;

import org.springframework.context.annotation.Profile;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.ll.eitcharge.domain.charger.chargerState.service.ChargerStateUpdateService;
import com.ll.eitcharge.global.app.AppConfig;

import lombok.RequiredArgsConstructor;

@Component
@Profile("prod")
@RequiredArgsConstructor
public class ChargerStateUpdateScheduler {

	private final ChargerStateUpdateService chargerStatusUpdateService;

	// 분기 (성능 테스트) 1: 초기에 redis에 모든 값을 다 넣고
	@Scheduled(fixedRate = 3 * 60 * 1000) // 초기 지연 시간 5분, 그 후 3분마다 실행
	public void updateChargerStateScheduled() {
		if (AppConfig.isAppInitialized) {
			chargerStatusUpdateService.updateChargerState();
		}
	}
}