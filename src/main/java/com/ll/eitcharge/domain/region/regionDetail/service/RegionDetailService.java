package com.ll.eitcharge.domain.region.regionDetail.service;

import com.ll.eitcharge.domain.region.regionDetail.entity.RegionDetail;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Service;

@Service
public class RegionDetailService {
    @PersistenceContext
    private EntityManager em;

    public boolean isRegionDetailExist(String zscode) {
        RegionDetail regionDetail = em.find(RegionDetail.class, zscode);
        return regionDetail != null;
    }

}
