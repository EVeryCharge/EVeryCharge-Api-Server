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
@Transactional(readOnly = true)
public class ChargingStationService {
	private final ChargingStationRepository chargingStationRepository;

	public ChargingStation findById(Long id) {
		return chargingStationRepository.findById(id).orElseThrow(GlobalException.E404::new);
	}
	// temp method for execute test
	public Optional<ChargingStation> findByIdOptional(Long id) {
		return chargingStationRepository.findById(id);
	}

	// temp method for execute test
	@Transactional
	public void create(String name) {
		ChargingStation chargingStation = ChargingStation.builder()
			.name(name)
			.build();

		chargingStationRepository.save(chargingStation);
	}
}
