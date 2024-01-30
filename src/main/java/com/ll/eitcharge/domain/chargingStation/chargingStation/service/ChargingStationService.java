package com.ll.eitcharge.domain.chargingStation.chargingStation.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.ll.eitcharge.domain.chargingStation.chargingStation.entity.ChargingStation;
import com.ll.eitcharge.domain.chargingStation.chargingStation.repository.ChargingStationRepository;
import com.ll.eitcharge.global.exceptions.GlobalException;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class ChargingStationService {
	private final ChargingStationRepository chargingStationRepository;

	public ChargingStation findById(String id) {
		return chargingStationRepository.findById(id).orElseThrow(GlobalException.E404::new);
	}

	public List<ChargingStation> findByKeyword(String keyword) {
		return chargingStationRepository.findByKeyword(keyword);
	}

	public Optional<ChargingStation> findByIdOptional(String statId) {
		return chargingStationRepository.findById(statId);
	}
}
