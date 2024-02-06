package com.ll.eitcharge.domain.operatingCompany.operatingCompany.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ll.eitcharge.domain.operatingCompany.operatingCompany.entity.OperatingCompany;
import com.ll.eitcharge.domain.operatingCompany.operatingCompany.repository.OperatingCompanyRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class OperatingCompanyService {
	private final OperatingCompanyRepository operatingCompanyRepository;

	public List<String> getPrimaryBusiIdList() {
		List<OperatingCompany> primaryCompanies = operatingCompanyRepository.findByIsPrimary("Y");
		return primaryCompanies.stream().map(OperatingCompany::getBusiId).toList();
	}

	public List<String> getPrimaryBnmList() {
		List<OperatingCompany> primaryCompanies = operatingCompanyRepository.findByIsPrimary("Y");
		return primaryCompanies.stream().map(OperatingCompany::getBnm).toList();
	}
}
