package com.ll.everycharge.domain.chargingStation.chargingStation.repository;

import com.ll.everycharge.domain.chargingStation.chargingStation.entity.ChargingStation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChargingStationRepository extends JpaRepository<ChargingStation, String> , ChargingStationRepositoryCustom {
    List<ChargingStation> findByLatBetweenAndLngBetween(double swLat, double neLat, double swLng, double neLng);

	@Query("SELECT cs FROM ChargingStation cs " +
		"WHERE cs.statNm LIKE %:kw% " +
		"OR cs.addr LIKE %:kw% ")
	List<ChargingStation> findByReportEditKw(@Param("kw") String kw);


	@Query(nativeQuery = true, value = """
    SELECT CS.*, ST_DISTANCE_SPHERE (CS.po1, POINT (:lng, :lat)) AS distance
    FROM (
        SELECT CS.*,
		POINT (CS.lng, CS.lat) AS po1
        FROM charging_station AS CS
        JOIN charger AS C ON CS.stat_id = C.stat_id
        JOIN region_detail AS RD ON CS.zscode = RD.zscode
        JOIN region AS R ON R.zcode = RD.zcode
        JOIN operating_company AS OC ON OC.busi_id = CS.busi_id
        WHERE (:parkingFree is null or CS.parking_free = :parkingFree)
        AND (:limitYn is null or CS.limit_yn = :limitYn)
        AND (:chgerTypes is null or C.chger_type IN (:chgerTypes))
        AND (:zscode is null or RD.zscode = :zscode)
        AND (:zcode is null or R.zcode = :zcode)
        AND (:isPrimary is null or OC.is_primary = :isPrimary)
        AND (:busiIds is null or OC.busi_id IN (:busiIds))
        AND (CS.stat_nm LIKE %:kw% OR CS.addr LIKE %:kw%)
        GROUP BY CS.stat_id
	) AS CS
	ORDER BY distance ASC;

""")
	Page<ChargingStation> searchList(@Param("limitYn") String limitYn,
									 @Param("parkingFree") String parkingFree,
									 @Param("zcode") String zcode,
									 @Param("zscode") String zscode,
									 @Param("isPrimary") String isPrimary,
									 @Param("busiIds") List<String> busiIds,
									 @Param("chgerTypes") List<String> chgerTypes,
									 @Param("kw") String kw,
									 @Param("lat") double lat,
									 @Param("lng") double lng,
									 Pageable pageable);

}
