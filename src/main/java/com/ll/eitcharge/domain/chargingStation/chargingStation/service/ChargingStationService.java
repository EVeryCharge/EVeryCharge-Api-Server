package com.ll.eitcharge.domain.chargingStation.chargingStation.service;

import java.net.URI;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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

	public List<ChargingStationSearchResponseDto> search(List<String> kwTypes, List<String> kws) {
		//return chargingStationRepository.search(kwTypes, kw);
		//						.findByLimitYnAndParkingFreeAndRegionDetail_Zcode_regionNameAndRegionDetail_regionDetailName(kws.get(0),kws.get(1), kws.get(2), kws.get(3));
		List<ChargingStation> chargingStations =
				chargingStationRepository
						.findByLimitYnAndParkingFreeAndRegionDetail_Zcode_regionNameAndRegionDetail_regionDetailNameAndOperatingCompanyBusiIdAndChargers_ChgerType(kws.get(0),kws.get(1), kws.get(2), kws.get(3), kws.get(4), kws.get(5));
		return chargingStations.stream()
				.map(ChargingStationSearchResponseDto::new)
				.collect(Collectors.toList());
	}
}
