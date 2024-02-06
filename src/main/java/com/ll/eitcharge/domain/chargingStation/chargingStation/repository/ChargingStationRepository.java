package com.ll.eitcharge.domain.chargingStation.chargingStation.repository;

import java.util.List;

import com.ll.eitcharge.domain.chargingStation.chargingStation.dto.ChargingStationSearchResponseDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ll.eitcharge.domain.chargingStation.chargingStation.entity.ChargingStation;

@Repository
public interface ChargingStationRepository extends JpaRepository<ChargingStation, String>, ChargingStationRepositoryCustom {
    List<ChargingStation> findByLatBetweenAndLngBetween(double swLat, double swLng, double neLat, double neLng);

	@Query("SELECT cs FROM ChargingStation cs " +
		"WHERE cs.statNm LIKE %:kw% " +
		"OR cs.regionDetail.regionDetailName LIKE %:kw% " +
		"OR cs.regionDetail.zcode.regionName LIKE %:kw% ")
	List<ChargingStation> findByReportEditKw(@Param("kw") String kw);

	List<ChargingStation> findByLimitYnAndParkingFreeAndRegionDetail_Zcode_regionNameAndRegionDetail_regionDetailNameAndOperatingCompanyBusiIdAndChargers_ChgerType(String kw,String kww, String kwww, String kwwww, String kwwwww, String kwwwwww);


}
