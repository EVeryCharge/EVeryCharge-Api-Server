package com.ll.eitcharge.domain.chargingStation.chargingStation.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ll.eitcharge.domain.chargingStation.chargingStation.entity.ChargingStation;

@Repository
public interface ChargingStationRepository extends JpaRepository<ChargingStation, String> {

	@Query("SELECT cs FROM ChargingStation cs " +
		"WHERE cs.statNm LIKE %:kw% " +
		"OR cs.regionDetail.regionDetailName LIKE %:kw% " +
		"OR cs.regionDetail.zcode.regionName LIKE %:kw%")
	List<ChargingStation> findByKw(@Param("kw") String kw);
}
