package com.ll.eitcharge.domain.chargeFee.chargeFee.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ll.eitcharge.domain.chargeFee.chargeFee.entity.ChargeFee;

@Repository
public interface ChargeFeeRepository extends JpaRepository<ChargeFee, Long> {
	Optional<ChargeFee> findByBnmAndChgerType(String bnm, String chgerType);
}
