package com.ll.everycharge.domain.chargingStation.chargingStation.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import com.ll.everycharge.domain.chargingStation.chargingStation.dto.ChargingStationSearchBaseDistanceResponseDto;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;

@Repository
public class ChargingStationSearchRepository {

	@PersistenceContext
	private EntityManager entityManager;

	/**
	 * 작성자 : 이상제
	 * @return statId 와 현 위치 기준 거리(m) 를 가진 DTO
	 */
	public Page<ChargingStationSearchBaseDistanceResponseDto> searchBaseDistance(
		String chargeable,
		String limitYn,
		String parkingFree,
		String zcode,
		String zscode,
		String isPrimary,
		List<String> busiIds,
		List<String> chgerTypes,
		String kw,
		double lat,
		double lng,
		int range,
		Pageable pageable
	) {

		String nativeQuery =
			"SELECT CS.stat_id AS statId, "
				+ "ST_DISTANCE_SPHERE (POINT(CS.lng, CS.lat), POINT (:lng, :lat)) AS distance, "
				+ "CS.stat_nm AS statNm, "
				+ "CS.addr AS addr, "
				+ "CS.lat AS lat, "
				+ "CS.lng AS lng, "
				+ "OC.bnm AS bnm, "
				+ "CS.parking_free AS parkingFree, "
				+ "CS.limit_yn AS limitYn, "
				+ "COUNT(C.stat_id) AS totalChger, "
				+ "SUM(CASE WHEN C.stat = 2 THEN 1 ELSE 0 END) AS availableChger, "
				+ "GROUP_CONCAT(DISTINCT C.chger_type) AS chgerTypes "
				+ "FROM charging_station AS CS "
				+ "JOIN charger AS C ON CS.stat_id = C.stat_id "
				+ "JOIN region_detail AS RD ON CS.zscode = RD.zscode "
				+ "JOIN region AS R ON R.zcode = RD.zcode "
				+ "JOIN operating_company AS OC ON OC.busi_id = CS.busi_id "
					+ "WHERE (:parkingFree is null or CS.parking_free = :parkingFree) "
					+ "AND (:limitYn is null or CS.limit_yn = :limitYn) "
					+ "AND (:zscode is null or RD.zscode = :zscode) " + "AND (:zcode is null or R.zcode = :zcode) "
					+ "AND (:isPrimary is null or OC.is_primary = :isPrimary) "
					+ "AND (ST_DISTANCE_SPHERE (POINT(CS.lng, CS.lat), POINT (:lng, :lat)) <= :range) ";

		// null에 따른 쿼리 추가
		if (kw != null) {
			nativeQuery += "AND (CS.stat_nm LIKE :kw OR CS.addr LIKE :kw) ";
		}
		if (chgerTypes != null && !chgerTypes.isEmpty()) {
			nativeQuery += "AND (C.chger_type IN (:chgerTypes)) ";
		}
		if (busiIds != null && !busiIds.isEmpty()) {
			nativeQuery += "AND (OC.busi_id IN (:busiIds)) ";
		}

		nativeQuery += "GROUP BY CS.stat_id ";
		if (chargeable != null && chargeable.contentEquals("Y")) {
			nativeQuery += "HAVING availableChger > 0 ";
		}
		nativeQuery += "ORDER BY distance ASC";

		Query query = entityManager.createNativeQuery(nativeQuery, ChargingStationSearchBaseDistanceResponseDto.class)
			.setParameter("limitYn", limitYn)
			.setParameter("parkingFree", parkingFree)
			.setParameter("zcode", zcode)
			.setParameter("zscode", zscode)
			.setParameter("isPrimary", isPrimary)
			.setParameter("lat", lat)
			.setParameter("lng", lng)
			.setParameter("range", range);

		// null 에 따른 파라미터 추가
		if (kw != null) {
			query.setParameter("kw", "%" + kw + "%");
		}
		if (chgerTypes != null && !chgerTypes.isEmpty()) {
			query.setParameter("chgerTypes", chgerTypes);
		}
		if (busiIds != null && !busiIds.isEmpty()) {
			query.setParameter("busiIds", busiIds);
		}

		// 결과 가져오기
		List<ChargingStationSearchBaseDistanceResponseDto> resultList = query.getResultList();

		// 페이지 생성
		int start = (int)pageable.getOffset();
		int end = Math.min((start + pageable.getPageSize()), resultList.size());
		Page<ChargingStationSearchBaseDistanceResponseDto> page = new PageImpl<>(
			resultList.subList(start, end),
			pageable,
			resultList.size()
		);

		return page;
	}
}