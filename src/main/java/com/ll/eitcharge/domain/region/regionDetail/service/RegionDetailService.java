package com.ll.eitcharge.domain.region.regionDetail.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ll.eitcharge.domain.region.regionDetail.entity.RegionDetail;
import com.ll.eitcharge.domain.region.regionDetail.repository.RegionDetailRepository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RegionDetailService {
    private final RegionDetailRepository regionDetailRepository;
    @PersistenceContext
    private EntityManager em;

    public boolean isRegionDetailExist(String zscode) {
        RegionDetail regionDetail = em.find(RegionDetail.class, zscode);
        return regionDetail != null;
    }

    public List<String> getZscodeListByZcode(String zcode) {
        List<RegionDetail> regionDetails = regionDetailRepository.findByFkZcode(zcode);
        return regionDetails.stream().map(RegionDetail::getZscode).toList();
    }

    public List<String> getRegionDetailNamesListByZcode(String zcode) {
        List<RegionDetail> regionDetails = regionDetailRepository.findByFkZcode(zcode);
        return regionDetails.stream().map(RegionDetail::getRegionDetailName).toList();
    }
}
