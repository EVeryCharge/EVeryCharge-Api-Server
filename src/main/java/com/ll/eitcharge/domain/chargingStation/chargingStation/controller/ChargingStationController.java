package com.ll.eitcharge.domain.chargingStation.chargingStation.controller;

import com.ll.eitcharge.domain.charger.charger.dto.ChargerStateDto;
import com.ll.eitcharge.domain.chargingStation.chargingStation.dto.ChargingStationResponseDto;
import com.ll.eitcharge.domain.chargingStation.chargingStation.entity.ChargingStation;
import com.ll.eitcharge.domain.chargingStation.chargingStation.service.ChargingStationApiService;
import com.ll.eitcharge.global.rsData.RsData;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/chargingStation")
public class ChargingStationController {

    private final ChargingStationApiService chargingStationApiService;

    @GetMapping("/status/charger/list/{id}")
    public RsData< List< ChargerStateDto > > getChargerState(@PathVariable("id") Long id){
        ChargingStation findChargingStation = chargingStationApiService.findById(id);
        List<ChargerStateDto> chargerStateDtos = findChargingStation.getChargers().stream()
                .map(ChargerStateDto::new)
                .collect(Collectors.toCollection(ArrayList::new));

        return RsData.of(
                "200",
                "성공",
                chargerStateDtos);
    };

    @GetMapping("/status/charger/test")
    public ResponseEntity< ChargingStationResponseDto > test(){
        return chargingStationApiService.findfromApi(1L);
    }

}
