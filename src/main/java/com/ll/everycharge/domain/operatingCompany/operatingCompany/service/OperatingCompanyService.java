package com.ll.everycharge.domain.operatingCompany.operatingCompany.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ll.everycharge.domain.operatingCompany.operatingCompany.entity.OperatingCompany;
import com.ll.everycharge.domain.operatingCompany.operatingCompany.repository.OperatingCompanyRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class OperatingCompanyService {
	private final OperatingCompanyRepository operatingCompanyRepository;

	// 엔티티 조회용
	public Optional<OperatingCompany> findByBnmOptional(String bnm) {
		return operatingCompanyRepository.findByBnm(bnm);
	}

	public List<String> getPrimaryBusiIdList() {
		List<OperatingCompany> primaryCompanies = operatingCompanyRepository.findByIsPrimary("Y");
		return primaryCompanies.stream().map(OperatingCompany::getBusiId).toList();
	}

	public List<String> getPrimaryBnmList() {
		List<OperatingCompany> primaryCompanies = operatingCompanyRepository.findByIsPrimary("Y");
		return primaryCompanies.stream().map(OperatingCompany::getBnm).toList();
	}
}
