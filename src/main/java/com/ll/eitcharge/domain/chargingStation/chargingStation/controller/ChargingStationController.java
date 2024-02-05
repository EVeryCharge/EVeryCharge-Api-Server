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

            // 지역 단위 코드 (ex. 서울시 : 11 경기도 : 41 ... ), TODO 현위치 로직 구현
            @RequestParam(value = "zcode", defaultValue = "") String zcode,

            // 지역 세부단위 코드 (ex. 종로구 : 11110, 서구 : 41130 ...)
            @RequestParam(value = "zscode", defaultValue = "") String zscode,

            // 상위 주요 기관 여부 (Y: 점유율 80% 상위 15개 기관 소속 충전소, N : 하위 기타 기관 소속 충전소)
            @RequestParam(value = "isPrimary", defaultValue = "") String isPrimary,

            // 운영 기관 코드 (ex. 차지비 : PI)
            @RequestParam(value = "busiId", defaultValue = "") String busiId,

            // 보유 충전기 타입 (01 ~ 08)
            @RequestParam(value = "chgerType", defaultValue = "") String chgerType,

            // 검색 키워드 (충전소명, 주소 LIKE)
            @RequestParam(value = "kw", defaultValue = "") String kw,

            // 페이지 정보 (1부터 시작)
            @RequestParam( defaultValue = "1") int page,

            // 페이지 사이즈
            @RequestParam( defaultValue = "20") int pageSize
    ){
        return ResponseEntity.ok(chargingStationService.search(
                limitYn, parkingFree, zcode, zscode, isPrimary, busiId, chgerType, kw, page, pageSize));
    }

}
