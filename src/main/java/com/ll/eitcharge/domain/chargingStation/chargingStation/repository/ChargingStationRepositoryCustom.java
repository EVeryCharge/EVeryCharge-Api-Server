package com.ll.eitcharge.domain.chargingStation.chargingStation.repository;

import com.ll.eitcharge.domain.chargingStation.chargingStation.dto.ChargingStationSearchResponseDto;

import java.util.List;

public interface ChargingStationRepositoryCustom {
    List<ChargingStationSearchResponseDto> search(List<String> kwTypes, String kw);
}
