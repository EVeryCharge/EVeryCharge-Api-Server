package com.ll.eitcharge.domain.chargingStation.chargingStation.controller;

import com.ll.eitcharge.domain.chargingStation.chargingStation.dto.ChargerStateDto;
import com.ll.eitcharge.domain.chargingStation.chargingStation.dto.ChargingStationItemDto;
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
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
public class
ChargingStationController {

    private final ChargingStationApiService chargingStationApiService;


    @GetMapping("/station/{stationId}/chargers")
    public RsData< HashMap > chargerState(@PathVariable("stationId") String stationId){
          return chargingStationApiService.findFromApi3(stationId);
    }
}
