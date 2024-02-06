package com.ll.eitcharge.domain.operatingCompany.operatingCompany.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ll.eitcharge.domain.operatingCompany.operatingCompany.entity.OperatingCompany;

public interface OperatingCompanyRepository extends JpaRepository<OperatingCompany, String> {

	List<OperatingCompany> findByIsPrimary(String isPrimary);
}
