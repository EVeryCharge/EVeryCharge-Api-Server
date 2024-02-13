package com.ll.eitcharge.domain.region.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ll.eitcharge.domain.region.RegionRepository;
import com.ll.eitcharge.domain.region.region.entity.Region;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RegionService {
	private final RegionRepository regionRepository;

	public List<String> getZcodeList() {
		List<Region> regions = regionRepository.findAll();
		return regions.stream().map(Region::getZcode).toList();
	}

	public List<String> getRegionNameList() {
		List<Region> regions = regionRepository.findAll();
        return regions.stream().map(Region::getRegionName).toList();
	}
}
