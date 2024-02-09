package com.ll.eitcharge.domain.chargingStation.chargingStation.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import com.ll.eitcharge.domain.chargingStation.chargingStation.dto.ChargingStationSearchBaseDistanceResponseDto;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;

@Repository
public class ChargingStationSearchRepository {

	@PersistenceContext
	private EntityManager entityManager;

	/**
	 * 작성자 : 이상제
	 * ChargingStationRepository의 네이티브 쿼리 현재 미작동 (엔티티에 없는 칼럼을 리턴하는 것이 원인으로 추정됨)
	 * @return statId 와 현 위치 기준 거리(m) 를 가진 DTO
	 */
	public Page<ChargingStationSearchBaseDistanceResponseDto> searchBaseDistance(
		String stat,
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
		+ 	"ST_DISTANCE_SPHERE (POINT(CS.lng, CS.lat), POINT (:lng, :lat)) AS distance, "
		+ 	"CS.stat_nm AS statNm, "
		+ 	"CS.addr AS addr, "
		+ 	"CS.lat AS lat, "
		+ 	"CS.lng AS lng, "
		+ 	"OC.bnm AS bnm, "
		+	"CS.parking_free AS parkingFree, "
		+	"CS.limit_yn AS limitYn, "
		+   "GROUP_CONCAT(DISTINCT C.chger_type) AS chgerTypes "
				+ "FROM charging_station AS CS "
				+ "JOIN charger AS C ON CS.stat_id = C.stat_id "
				+ "JOIN region_detail AS RD ON CS.zscode = RD.zscode "
				+ "JOIN region AS R ON R.zcode = RD.zcode "
				+ "JOIN operating_company AS OC ON OC.busi_id = CS.busi_id "
				+ "WHERE (:parkingFree is null or CS.parking_free = :parkingFree) "
				+ "AND (:limitYn is null or CS.limit_yn = :limitYn) "
				+ "AND (:chgerTypes is null or C.chger_type IN (:chgerTypes)) "
				+ "AND EXISTS ("
				+ 		"SELECT 1 FROM charger AS C2 WHERE C2.stat = :stat OR :stat is null) "
				+ "AND (:zscode is null or RD.zscode = :zscode) " + "AND (:zcode is null or R.zcode = :zcode) "
				+ "AND (:isPrimary is null or OC.is_primary = :isPrimary) "
				+ "AND (:busiIds is null or OC.busi_id IN (:busiIds)) "
				+ "AND (ST_DISTANCE_SPHERE (POINT(CS.lng, CS.lat), POINT (:lng, :lat)) <= :range) ";

		// 만약 kw가 null이 아닌 경우에만 LIKE 절 추가
		if (kw != null) {
			nativeQuery += "AND (CS.stat_nm LIKE :kw OR CS.addr LIKE :kw) ";
		}

		nativeQuery += "GROUP BY CS.stat_id "
			+ "ORDER BY distance ASC";

		Query query = entityManager.createNativeQuery(nativeQuery, ChargingStationSearchBaseDistanceResponseDto.class)
			.setParameter("stat", stat)
			.setParameter("limitYn", limitYn)
			.setParameter("parkingFree", parkingFree)
			.setParameter("zcode", zcode)
			.setParameter("zscode", zscode)
			.setParameter("isPrimary", isPrimary)
			.setParameter("busiIds", busiIds)
			.setParameter("chgerTypes", chgerTypes)
			.setParameter("lat", lat)
			.setParameter("lng", lng)
			.setParameter("range", range);

		// kw가 null이 아닌 경우에만 파라미터로 추가
		if (kw != null) {
			query.setParameter("kw", kw + "%");
		}

		// 결과 가져오기
		List<ChargingStationSearchBaseDistanceResponseDto> resultList = query.getResultList();

		// 페이지 생성
		int start = (int)pageable.getOffset();
		int end = Math.min((start + pageable.getPageSize()), resultList.size());
		Page<ChargingStationSearchBaseDistanceResponseDto> page = new PageImpl<>(resultList.subList(start, end), pageable,
			resultList.size());

		return page;
	}
}