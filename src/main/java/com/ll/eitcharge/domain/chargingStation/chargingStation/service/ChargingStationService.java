package com.ll.eitcharge.domain.chargingStation.chargingStation.service;

import java.util.Optional;

import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

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

	// temp method for execute test
	public Optional<ChargingStation> findByIdOptional(String statId) {
		return chargingStationRepository.findById(statId);
	}

	// temp method for execute test
	@Transactional
	public void create(String statId, String statNm) {
		ChargingStation chargingStation = ChargingStation.builder()
			.statId(statId)
			.statNm(statNm)
			.build();

		chargingStationRepository.save(chargingStation);
	}
}
