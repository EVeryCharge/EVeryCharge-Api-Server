package com.ll.eitcharge.domain.chargingStation.chargingStation.controller;

import com.ll.eitcharge.domain.chargingStation.chargingStation.dto.ChargerStateDto;
import com.ll.eitcharge.domain.chargingStation.chargingStation.dto.ChargingStationSearchResponseDto;
import com.ll.eitcharge.domain.chargingStation.chargingStation.dto.ChargingStationSearchResponseDtoWithExecuteTime;
import com.ll.eitcharge.domain.chargingStation.chargingStation.entity.ChargingStation;
import com.ll.eitcharge.domain.chargingStation.chargingStation.service.ChargingStationService;
import com.ll.eitcharge.global.rsData.RsData;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import static org.springframework.util.MimeTypeUtils.APPLICATION_JSON_VALUE;

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
    @Operation(summary = "충전소 검색", description = "위도 경도 기반 충전소 검색")
    public ResponseEntity<List<ChargingStationSearchResponseDto>> searchStation(
            @RequestParam double swLat,
            @RequestParam double swLng,
            @RequestParam double neLat,
            @RequestParam double neLng
    ) {
        return ResponseEntity.ok(chargingStationService.findByLatBetweenAndLngBetween(swLat, swLng, neLat, neLng));
    }

    @GetMapping("/chargerStatus/fromApi")
    @Operation(summary = "충전기 상태조회", description = "충전소에 포함된 충전기들의 상태조회(공공데이터 포탈 api)")
    public RsData< Object > chargerStateApi(@RequestParam String statId){
        return chargingStationService.findFromApi(statId);
    }

    @GetMapping("/chargerStatus")
    @Operation(summary = "충전기 상태조회", description = "충전소에 포함된 충전기들의 상태조회(데이터 베이스)")
    public ResponseEntity<List<ChargerStateDto>> chargerStateSearch(@RequestParam String statId){
        return ResponseEntity.ok(chargingStationService.chargerStateSearch(statId));
    }

    @Operation(summary = "충전소 검색", description = "키워드 단위 충전소 검색 (Param)")
    @GetMapping("/search")
    public ResponseEntity<ChargingStationSearchResponseDtoWithExecuteTime> list(
            // 개방 여부 (Y / N)
            @RequestParam(value = "limitYn", defaultValue = "") String limitYn,

            // 무료 주차 (Y / N)
            @RequestParam(value = "parkingFree", defaultValue = "") String parkingFree,

            // 지역 단위 코드 (ex. 서울시 : 11 경기도 : 41 ... ), TODO 현위치 로직 구현
            @RequestParam(value = "zcode", defaultValue = "") String zcode,

            // 지역 세부단위 코드 (ex. 종로구 : 11110, 서구 : 41130 ...)
            @RequestParam(value = "zscode", defaultValue = "") String zscode,

            // 상위 주요 기관 여부 (Y: 점유율 80% 상위 15개 기관 소속 충전소, N : 하위 기타 기관 소속 충전소)
            @RequestParam(value = "isPrimary", defaultValue = "") String isPrimary,

            // 기관 코드 (ex. 차지비 : PI)
            @RequestParam(value = "busiId", defaultValue = "") List<String> busiIds,

            // 보유 충전기 타입 (01 ~ 08)
            @RequestParam(value = "chgerType", defaultValue = "") List<String> chgerTypes,

            // 검색 키워드 (충전소명, 주소 LIKE)
            @RequestParam(value = "kw", defaultValue = "") String kw,

            // 페이지 정보 (1부터 시작)
            @RequestParam( defaultValue = "1") int page,

            // 페이지 사이즈
            @RequestParam( defaultValue = "20") int pageSize
    ){
        return ResponseEntity.ok(chargingStationService.search(
                limitYn, parkingFree, zcode, zscode, isPrimary, busiIds, chgerTypes, kw, page, pageSize));
    }


}
