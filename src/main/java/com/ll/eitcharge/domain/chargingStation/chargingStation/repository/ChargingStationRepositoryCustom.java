package com.ll.eitcharge.domain.chargingStation.chargingStation.repository;

import com.ll.eitcharge.domain.chargingStation.chargingStation.dto.ChargingStationSearchResponseDto;
import com.ll.eitcharge.domain.chargingStation.chargingStation.entity.ChargingStation;

import java.util.List;

public interface ChargingStationRepositoryCustom {
    List<ChargingStation> search(String limitYn, String parkingFree, String zcode, String zscode,String isPrimary, String busiId, String chgerType, String kw);
}
