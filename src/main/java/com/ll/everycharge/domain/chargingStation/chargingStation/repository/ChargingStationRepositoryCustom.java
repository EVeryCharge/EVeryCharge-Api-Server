package com.ll.everycharge.domain.chargingStation.chargingStation.repository;

import com.ll.everycharge.domain.chargingStation.chargingStation.entity.ChargingStation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ChargingStationRepositoryCustom {
    Page<ChargingStation> searchBaseStatNm(String limitYn, String parkingFree, String zcode, String zscode, String isPrimary, List<String> busiIds, List<String> chgerType, String kw, Pageable pageable);

}
