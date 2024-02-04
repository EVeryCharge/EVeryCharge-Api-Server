package com.ll.eitcharge.domain.technicalManager.technicalManager.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ll.eitcharge.domain.chargingStation.chargingStation.entity.ChargingStation;
import com.ll.eitcharge.domain.member.member.entity.Member;
import com.ll.eitcharge.domain.technicalManager.technicalManager.entity.TechnicalManager;
import com.ll.eitcharge.domain.technicalManager.technicalManager.repository.TechnicalManagerRepository;
import com.ll.eitcharge.global.exceptions.GlobalException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TechnicalManagerService {
	private final TechnicalManagerRepository technicalManagerRepository;

	public TechnicalManager findByName(String name) {
        return technicalManagerRepository.findByName(name).orElseThrow(GlobalException.E404::new);
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
