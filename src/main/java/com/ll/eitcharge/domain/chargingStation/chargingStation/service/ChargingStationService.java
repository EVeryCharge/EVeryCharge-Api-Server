package com.ll.eitcharge.domain.chargingStation.chargingStation.service;

import java.net.URI;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import com.ll.eitcharge.domain.chargingStation.chargingStation.dto.ChargingStationSearchResponseDtoWithExecuteTime;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.util.UriComponentsBuilder;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ll.eitcharge.domain.chargingStation.chargingStation.dto.ChargingStationSearchResponseDto;
import com.ll.eitcharge.domain.chargingStation.chargingStation.entity.ChargingStation;
import com.ll.eitcharge.domain.chargingStation.chargingStation.repository.ChargingStationRepository;
import com.ll.eitcharge.global.exceptions.GlobalException;
import com.ll.eitcharge.global.rsData.RsData;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ChargingStationService {
	private final ChargingStationRepository chargingStationRepository;
	private final ObjectMapper objectMapper;

	public List<ChargingStationSearchResponseDto> findByLatBetweenAndLngBetween(double swLat, double swLng, double neLat, double neLng) {
		List<ChargingStation> chargingStations = chargingStationRepository.findByLatBetweenAndLngBetween(swLat, neLat, swLng, neLng);
		return chargingStations.stream()
				.map(ChargingStationSearchResponseDto::new)
				.collect(Collectors.toList());
	}

	public List<ChargingStation> findByReportEditKw(String kw) {
		return chargingStationRepository.findByReportEditKw(kw);
	}

	public RsData<Object> findFromApi(String statId) {
		WebClient webClient = WebClient.create();

		String serviceKey = "%2B61CsEc7Nmo65NvzqtjoQh0FPR0CAdc45WlyZDPkxYDqeSxUJ4E1ncpqn2H2qyN%2BHFXNqJD6JbNbghaWu9Tctw%3D%3D";
		String numOfRows = "100";
		String pageNo = "1";

		URI uri = UriComponentsBuilder.fromUriString("https://apis.data.go.kr/B552584/EvCharger/getChargerInfo")
			.queryParam("serviceKey", serviceKey)
			.queryParam("numOfRows", numOfRows)
			.queryParam("pageNo", pageNo)
			.queryParam("statId", statId)
			.build(true)
			.toUri();

		String response = webClient.get()
			.uri(uri)
			.header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
			.retrieve()
			.bodyToMono(String.class)
			.block();

		HashMap hashMap = null;
		try {
			hashMap = objectMapper.readValue(response, HashMap.class);
		} catch (JsonProcessingException e) {
			throw new RuntimeException("JSON 파싱 오류", e);
		}

		RsData<Object> rsData = RsData.of(hashMap.get("items"));

		return rsData;
	}
	// 엔티티 조회용
	public ChargingStation findById(String id) {
		return chargingStationRepository.findById(id).orElseThrow(GlobalException.E404::new);
	}

	// 엔티티 조회용
	public Optional<ChargingStation> findByIdOptional(String statId) {
		return chargingStationRepository.findById(statId);
	}


	public ChargingStationSearchResponseDtoWithExecuteTime search(
			String limitYn,
			String parkingFree,
			String zcode,
			String zscode,
			String isPrimary,
			String busiId,
			String chgerType,
			String kw,
			Pageable pageable
	) {

		// 검색 시간 측정 시작
		long startTime = System.nanoTime();
		
		Page<ChargingStation> chargingStations = chargingStationRepository.search(limitYn,parkingFree,zcode,zscode,isPrimary, busiId,chgerType, kw, pageable);

		// 검색 시간 측정 끝
		long endTime = System.nanoTime();

		// 검색 경과시간(나노 초 단위)
		long executionTimeInNano = endTime-startTime;
		String executionTimeResult = String.format("실행 시간 (ns): %d , 실행시간 (ms): %d , 실행시간 : %d 초",
				executionTimeInNano,
				executionTimeInNano / 1_000_000,
				(long) (executionTimeInNano / 1_000_000_000.0));

		return new ChargingStationSearchResponseDtoWithExecuteTime(executionTimeResult, chargingStations.map(ChargingStationSearchResponseDto::new));
	}
}
