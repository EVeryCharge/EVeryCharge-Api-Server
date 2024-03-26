package com.ll.everycharge.domain.chargingStation.chargingStation.service;

import java.net.URI;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.util.UriComponentsBuilder;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ll.everycharge.domain.chargeFee.chargeFee.entity.ChargeFee;
import com.ll.everycharge.domain.chargeFee.chargeFee.service.ChargeFeeService;
import com.ll.everycharge.domain.charger.charger.dto.ChargerStateDto;
import com.ll.everycharge.domain.charger.charger.entity.Charger;
import com.ll.everycharge.domain.charger.charger.entity.ChargerType;
import com.ll.everycharge.domain.charger.charger.repository.ChargerRepository;
import com.ll.everycharge.domain.chargingStation.chargingStation.dto.ChargingStationInfoResponseDto;
import com.ll.everycharge.domain.chargingStation.chargingStation.dto.ChargingStationSearchBaseDistanceResponseDto;
import com.ll.everycharge.domain.chargingStation.chargingStation.dto.ChargingStationSearchItemResponseDto;
import com.ll.everycharge.domain.chargingStation.chargingStation.dto.ChargingStationSearchResponseDto;
import com.ll.everycharge.domain.chargingStation.chargingStation.entity.ChargingStation;
import com.ll.everycharge.domain.chargingStation.chargingStation.repository.ChargingStationRepository;
import com.ll.everycharge.domain.chargingStation.chargingStation.repository.ChargingStationSearchRepository;
import com.ll.everycharge.domain.operatingCompany.operatingCompany.service.OperatingCompanyService;
import com.ll.everycharge.domain.region.regionDetail.service.RegionDetailService;
import com.ll.everycharge.domain.region.service.RegionService;
import com.ll.everycharge.global.app.AppConfig;
import com.ll.everycharge.global.exceptions.GlobalException;
import com.ll.everycharge.global.rsData.RsData;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class ChargingStationService {
	private final ObjectMapper objectMapper;
	private final RegionService regionService;
	private final ChargeFeeService chargeFeeService;
	private final ChargerRepository chargerRepository;
	private final RegionDetailService regionDetailService;
	private final OperatingCompanyService operatingCompanyService;
	private final ChargingStationRepository chargingStationRepository;
	private final ChargingStationSearchRepository chargingStationSearchRepository;

	// 엔티티 조회용
	public ChargingStation findById(String id) {
		return chargingStationRepository.findById(id).orElseThrow(GlobalException.E404::new);
	}

	// 엔티티 조회용
	public List<ChargingStation> findAll() {
		return chargingStationRepository.findAll();
	}

	// 엔티티 조회용
	public Optional<ChargingStation> findByIdOptional(String statId) {
		return chargingStationRepository.findById(statId);
	}

	public List<ChargingStationSearchResponseDto> findByLatBetweenAndLngBetween(double swLat, double swLng,
		double neLat, double neLng) {
		List<ChargingStation> chargingStations = chargingStationRepository.findByLatBetweenAndLngBetween(swLat, neLat,
			swLng, neLng);
		return chargingStations.stream()
			.map(ChargingStationSearchResponseDto::new)
			.toList();
	}

	public List<ChargingStation> findByReportEditKw(String kw) {
		return chargingStationRepository.findByReportEditKw(kw);
	}

	public RsData<Object> findFromApi(String statId) {
		WebClient webClient = WebClient.create();

		String serviceKey = AppConfig.getApiServiceKey();
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

	public ChargingStationSearchItemResponseDto getSearchMenuBaseItem() {
		return new ChargingStationSearchItemResponseDto(
			regionService.getZcodeList(),
			regionService.getRegionNameList(),
			operatingCompanyService.getPrimaryBusiIdList(),
			operatingCompanyService.getPrimaryBnmList(),
			ChargerType.values()
		);
	}

	public ChargingStationSearchItemResponseDto getSearchMenuRegionDetailItem(String zcode) {
		return new ChargingStationSearchItemResponseDto(
			regionDetailService.getZscodeListByZcode(zcode),
			regionDetailService.getRegionDetailNamesListByZcode(zcode)
		);
	}

	public Page<ChargingStationSearchResponseDto> searchBaseStatNm(
		String limitYn,
		String parkingFree,
		String zcode,
		String zscode,
		String isPrimary,
		List<String> busiIds,
		List<String> chgerTypes,
		String kw,
		int page,
		int pageSize
	) {
		List<Sort.Order> sorts = new ArrayList<>();
		sorts.add(Sort.Order.desc("statNm"));
		Pageable pageable = PageRequest.of(page - 1, pageSize, Sort.by(sorts));

		Page<ChargingStation> chargingStations = chargingStationRepository.searchBaseStatNm(
			limitYn, parkingFree, zcode, zscode, isPrimary, busiIds, chgerTypes, kw, pageable
		);

		return chargingStations.map(ChargingStationSearchResponseDto::new);
	}

	public List<ChargerStateDto> chargerStateSearch(String statId) {

		List<Charger> chargerStates = chargerRepository.findByChargingStationStatId(statId);
		return chargerStates.stream()
			.map(ChargerStateDto::new)
			.collect(Collectors.toList());
	}

	@Transactional(readOnly = true)
	public Page<ChargingStationSearchBaseDistanceResponseDto> searchBaseDistance(
		String chargeable,
		String limitYn,
		String parkingFree,
		String zcode,
		String zscode,
		String isPrimary,
		List<String> busiIds,
		List<String> chgerTypes,
		String kw,
		int page,
		int pageSize,
		double lng,
		double lat,
		int range
	) {
		Pageable pageable = PageRequest.of(page - 1, pageSize);

		return chargingStationSearchRepository.searchBaseDistance(
			chargeable, limitYn, parkingFree, zcode, zscode, isPrimary, busiIds, chgerTypes, kw, lat, lng, range, pageable
		);
	}

	public ChargingStationInfoResponseDto infoSearch(String statId) {
		ChargingStation chargingStation = findById(statId);
		List<ChargeFee> chargeFeeList = chargeFeeService.findByBnm(chargingStation.getOperatingCompany().getBnm());

		return new ChargingStationInfoResponseDto(chargingStation, chargeFeeList);
	}
}
