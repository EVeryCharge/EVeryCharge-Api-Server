package com.ll.eitcharge.domain.chargingStation.chargingStation.repository;

import com.ll.eitcharge.domain.chargingStation.chargingStation.dto.ChargingStationSearchResponseDto;
import com.ll.eitcharge.domain.chargingStation.chargingStation.entity.ChargingStation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ChargingStationRepositoryCustom {
    Page<ChargingStation> search(String limitYn, String parkingFree, String zcode, String zscode, String isPrimary, List<String> busiIds, List<String> chgerType, String kw, Pageable pageable);

}
