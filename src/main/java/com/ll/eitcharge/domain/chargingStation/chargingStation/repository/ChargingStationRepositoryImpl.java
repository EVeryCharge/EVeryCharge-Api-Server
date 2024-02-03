package com.ll.eitcharge.domain.chargingStation.chargingStation.repository;

import com.ll.eitcharge.domain.chargingStation.chargingStation.dto.ChargingStationSearchResponseDto;
import lombok.RequiredArgsConstructor;

import java.util.List;

@RequiredArgsConstructor
public class ChargingStationRepositoryImpl implements ChargingStationRepositoryCustom{
    @Override
    public List<ChargingStationSearchResponseDto> search(List<String> kwTypes, String kw) {
        return null;
    }
}
