package com.ll.eitcharge.domain.chargingStation.chargingStation.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.ll.eitcharge.domain.chargingStation.chargingStation.entity.ChargingStation;

@Repository
public interface ChargingStationRepository extends JpaRepository<ChargingStation, String> {

	@Query("SELECT cs FROM ChargingStation cs " +
		"WHERE cs.statNm LIKE %:keyword% " +
		"OR cs.regionDetail.regionDetailName LIKE %:keyword% " +
		"OR cs.regionDetail.region.regionName LIKE %:keyword%")
	List<ChargingStation> findByKeyword(String keyword);
}
