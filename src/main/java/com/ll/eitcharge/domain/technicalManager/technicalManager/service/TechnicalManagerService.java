package com.ll.eitcharge.domain.technicalManager.technicalManager.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
}
