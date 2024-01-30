package com.ll.eitcharge.domain.chargingStation.chargingStation.controller;

import com.ll.eitcharge.domain.chargingStation.chargingStation.service.ChargingStationApiService;
import com.ll.eitcharge.global.rsData.RsData;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class
ChargingStationController {

    private final ChargingStationApiService chargingStationApiService;


    @GetMapping("/station/{stationId}/chargers")
    public RsData< Object > chargerState(@PathVariable("stationId") String stationId){
          return chargingStationApiService.findFromApi3(stationId);
    }
}
