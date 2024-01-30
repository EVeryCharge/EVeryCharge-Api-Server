package com.ll.eitcharge.domain.chargingStation.chargingStation.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.ll.eitcharge.domain.chargingStation.chargingStation.dto.ChargingStationSearchResponseDto;
import com.ll.eitcharge.domain.chargingStation.chargingStation.entity.ChargingStation;
import com.ll.eitcharge.domain.chargingStation.chargingStation.repository.ChargingStationRepository;
import com.ll.eitcharge.global.exceptions.GlobalException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ChargingStationService {
	private final ChargingStationRepository chargingStationRepository;

	public List<ChargingStationSearchResponseDto> findByLatBetweenAndLngBetween(double swLat, double swLng, double neLat, double neLng) {
		List<ChargingStation> chargingStations = chargingStationRepository.findByLatBetweenAndLngBetween(swLat, swLng, neLat, neLng);
		return chargingStations.stream()
				.map(ChargingStationSearchResponseDto::new)
				.collect(Collectors.toList());
	}

	public List<ChargingStation> findByReportEditKw(String kw) {
		return chargingStationRepository.findByReportEditKw(kw);
	}

	// 엔티티 조회용
	public ChargingStation findById(String id) {
		return chargingStationRepository.findById(id).orElseThrow(GlobalException.E404::new);
	}

	// 엔티티 조회용
	public Optional<ChargingStation> findByIdOptional(String statId) {
		return chargingStationRepository.findById(statId);
	}
}
