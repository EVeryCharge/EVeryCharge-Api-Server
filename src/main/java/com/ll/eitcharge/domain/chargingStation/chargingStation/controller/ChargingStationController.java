package com.ll.eitcharge.domain.chargingStation.chargingStation.controller;

import static org.springframework.util.MimeTypeUtils.*;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ll.eitcharge.domain.chargingStation.chargingStation.dto.ChargingStationSearchResponseDto;
import com.ll.eitcharge.domain.chargingStation.chargingStation.entity.ChargingStation;
import com.ll.eitcharge.domain.chargingStation.chargingStation.service.ChargingStationService;
import com.ll.eitcharge.global.rsData.RsData;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping(value = "/api/v1/chargingStation", produces = APPLICATION_JSON_VALUE)
@Tag(name = "ChargingStationController", description = "충전소 컨트롤러 API")
@RequiredArgsConstructor
public class ChargingStationController {

    private final ChargingStationService chargingStationService;

    @GetMapping("/{id}")
    public ResponseEntity<ChargingStation> get(String id) {
        return ResponseEntity.ok(chargingStationService.findById(id));
    }

    @GetMapping("/location/search")
    public ResponseEntity<List<ChargingStationSearchResponseDto>> searchStation(
            @RequestParam double swLat,
            @RequestParam double swLng,
            @RequestParam double neLat,
            @RequestParam double neLng
    ) {
        return ResponseEntity.ok(chargingStationService.findByLatBetweenAndLngBetween(swLat, swLng, neLat, neLng));
    }

    @GetMapping("/{stationId}/chargers")
    public RsData< Object > chargerState(@PathVariable("stationId") String stationId){
        return chargingStationService.findFromApi(stationId);
    }

    // 아래서부터 추가
    @GetMapping("/list")
    public ResponseEntity<List<ChargingStationSearchResponseDto>> list(
            @RequestParam(value = "kwType", defaultValue = "") List<String> kwTypes,
            @RequestParam(value = "kw", defaultValue = "") List<String> kws
    ){
        return ResponseEntity.ok(chargingStationService.search(kwTypes, kws));
    }

}
