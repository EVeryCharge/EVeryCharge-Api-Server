package com.ll.eitcharge.domain.chargingStation.chargingStation.controller;

import static org.springframework.util.MimeTypeUtils.*;

import java.util.ArrayList;
import java.util.List;

import com.ll.eitcharge.domain.chargingStation.chargingStation.dto.ChargingStationSearchResponseDtoWithExecuteTime;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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

    @Operation(summary = "충전소 검색", description = "키워드 단위 충전소 검색 (Param)")
    @GetMapping("/search")
    public ResponseEntity<ChargingStationSearchResponseDtoWithExecuteTime> list(
            // 개방여부 (Y / N)
            @RequestParam(value = "limitYn", defaultValue = "") String limitYn,
            // 무료주차 (Y / N)
            @RequestParam(value = "parkingFree", defaultValue = "") String parkingFree,
//            @RequestParam(value = "zcode", defaultValue = "") String zcode,
            // 지역단위이름 (ex. 서울시, 광주시, 익산시 ...), TODO 현위치 로직 구현
            @RequestParam(value = "regionName", defaultValue = "") String regionName,
//            @RequestParam(value = "zscode", defaultValue = "") String zscode,
            // 지역세부단위이름 (ex. 종로구, 서구 ...)
            @RequestParam(value = "regionDetailName", defaultValue = "") String regionDetailName,
            // 상위 주요 기관 여부 (Y: bnm에 따른 각 기관별 조회 / N: bnm 상관 없이 기관 전체 조회)
            @RequestParam(value = "isPrimary", defaultValue = "") String isPrimary,
//            @RequestParam(value = "busiId", defaultValue = "") String busiId,
            // 운영기관명
            @RequestParam(value = "bnm", defaultValue = "") String bnm,
            // 충전기 타입명 (01 ~ 08)
            @RequestParam(value = "chgerType", defaultValue = "") String chgerType,
            // 검색 키워드 (충전소명, 주소 LIKE)
            @RequestParam(value = "kw", defaultValue = "") String kw,
            @RequestParam( defaultValue = "1") int page

    ){
        List<Sort.Order> sorts = new ArrayList<>();
        sorts.add(Sort.Order.desc("statId"));
        Pageable pageable = PageRequest.of(page - 1, 10, Sort.by(sorts));

        return ResponseEntity.ok(chargingStationService.search(
                limitYn, parkingFree, regionName, regionDetailName, isPrimary, bnm, chgerType, kw, pageable));
    }

}
