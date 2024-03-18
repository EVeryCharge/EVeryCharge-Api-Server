package com.ll.eitcharge.domain.charger.update.charger.batch.config;

import org.springframework.context.annotation.Configuration;

import com.ll.eitcharge.domain.charger.charger.repository.ChargerRepository;
import com.ll.eitcharge.domain.chargingStation.chargingStation.repository.ChargingStationRepository;
import com.ll.eitcharge.domain.operatingCompany.operatingCompany.repository.OperatingCompanyRepository;
import com.ll.eitcharge.domain.region.RegionRepository;
import com.ll.eitcharge.domain.region.regionDetail.repository.RegionDetailRepository;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class ChargerBatchUpdateConfig {
	@Getter
	@Setter
	private boolean isBatchUpdateRunning = true;

	private final RegionRepository regionRepository;
	private final RegionDetailRepository regionDetailRepository;
	private final OperatingCompanyRepository operatingCompanyRepository;
	private final ChargingStationRepository chargingStationRepository;
	private final ChargerRepository chargerRepository;

	// batch properties
	@Getter
	private final int CHUNK_SIZE = 500;
	@Getter
	private final String baseUrl = "https://apis.data.go.kr/B552584/EvCharger/getChargerInfo";
	@Getter
	private final String contentType = "JSON";
	@Getter
	private final int priod = 10; // 갱신기간(분)

	// @Bean
	// public Job ChargerBatchUpdateJob(JobRepository jobRepository, Step chargerBatchUpdateStep) {
	// 	return new JobBuilder("ChargerBatchUpdateJob", jobRepository)
	// 		.start(chargerBatchUpdateStep)
	// 		.build();
	// }
	//
	// @JobScope
	// @Bean
	// public Step chargerBatchUpdateStep(JobRepository jobRepository){
	//
    // }
}
