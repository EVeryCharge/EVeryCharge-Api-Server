package com.ll.everycharge.domain.technicalManager.technicalManager.service;

import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ll.everycharge.domain.chargingStation.chargingStation.entity.ChargingStation;
import com.ll.everycharge.domain.member.member.entity.Member;
import com.ll.everycharge.domain.technicalManager.technicalManager.entity.TechnicalManager;
import com.ll.everycharge.domain.technicalManager.technicalManager.repository.TechnicalManagerRepository;
import com.ll.everycharge.global.exceptions.GlobalException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TechnicalManagerService {
	private final TechnicalManagerRepository technicalManagerRepository;

	//서비스 레이어 간 엔티티 조회용
	public TechnicalManager findByName(String name) {
		return technicalManagerRepository.findByName(name).orElseThrow(GlobalException.E404::new);
	}

	//서비스 레이어 간 엔티티 조회용
	public Optional<TechnicalManager> findByNameOptional(String name) {
		return technicalManagerRepository.findByName(name);
	}

	// temp method for execute test
	@Transactional
	public void create(Member member, ChargingStation chargingStation) {
		TechnicalManager technicalManager = TechnicalManager.builder()
			.member(member)
			.chargingStation(chargingStation)
			.name(member.getName()) // member, Manager username은 동일하게
			.build();

		technicalManagerRepository.save(technicalManager);
	}
}
