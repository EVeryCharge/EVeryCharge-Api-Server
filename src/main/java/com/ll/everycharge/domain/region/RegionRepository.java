package com.ll.everycharge.domain.region;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ll.everycharge.domain.region.region.entity.Region;

@Repository
public interface RegionRepository extends JpaRepository<Region, String> {
}
