package com.ll.everycharge.domain.operatingCompany.operatingCompany.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ll.everycharge.domain.operatingCompany.operatingCompany.entity.OperatingCompany;

public interface OperatingCompanyRepository extends JpaRepository<OperatingCompany, String> {

	List<OperatingCompany> findByIsPrimary(String isPrimary);

	Optional<OperatingCompany> findByBnm(String bnm);
}
