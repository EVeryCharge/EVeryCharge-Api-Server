package com.ll.everycharge.domain.region.regionDetail.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ll.everycharge.domain.region.regionDetail.entity.RegionDetail;

@Repository
public interface RegionDetailRepository extends JpaRepository<RegionDetail, String> {
	@Query("SELECT rd FROM RegionDetail rd WHERE rd.zcode.zcode = :zcode")
	List<RegionDetail> findByFkZcode(@Param("zcode") String zcode);
}
