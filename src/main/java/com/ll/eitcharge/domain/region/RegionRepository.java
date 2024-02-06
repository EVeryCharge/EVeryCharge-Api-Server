package com.ll.eitcharge.domain.region;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ll.eitcharge.domain.region.region.entity.Region;

@Repository
public interface RegionRepository extends JpaRepository<Region, String> {
}
