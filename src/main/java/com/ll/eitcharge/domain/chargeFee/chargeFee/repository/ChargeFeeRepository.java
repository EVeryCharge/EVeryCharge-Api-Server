package com.ll.eitcharge.domain.chargeFee.chargeFee.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.ll.eitcharge.domain.chargeFee.chargeFee.entity.ChargeFee;

@Repository
public interface ChargeFeeRepository extends JpaRepository<ChargeFee, Long> {

	List<ChargeFee> findByBnm(String bnm);

	Optional<ChargeFee> findByBnmAndChgerType(String bnm, String chgerType);

	@Query("SELECT cf FROM ChargeFee cf "
		+ "WHERE (:bnms IS NULL OR cf.bnm IN :bnms) "
		+ "AND (:chgerType IS NULL OR cf.chgerType = :chgerType)")
	List<ChargeFee> findAllByBnmsAndChgerType(List<String> bnms, String chgerType);
}
