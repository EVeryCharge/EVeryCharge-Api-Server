package com.ll.eitcharge.domain.charger.update.chargerState.service;

import org.springframework.context.annotation.Configuration;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
@Configuration
@RequiredArgsConstructor
public class ChargerStateUpdateConfig {

	@Setter
	private boolean isUpdateRunning = false;

	private final String baseUrl = "https://apis.data.go.kr/B552584/EvCharger/getChargerStatus";

	private final String contentType = "JSON";

	private final int numOfRows = 10000; // api의 응답 데이터, 응답 10000개 넘지 않을 것으로 예상. 10000개 넘을 시 리팩토링

	private final int pageNo = 1;

	private final int period = 10; // 갱신기간(분)
}
