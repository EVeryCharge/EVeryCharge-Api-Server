package com.ll.eitcharge.domain.chargingStation.chargingStation.controller;

import static org.springframework.util.MimeTypeUtils.*;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ll.eitcharge.domain.charger.charger.dto.ChargerStateDto;
import com.ll.eitcharge.domain.chargingStation.chargingStation.dto.ChargingStationInfoResponseDto;
import com.ll.eitcharge.domain.chargingStation.chargingStation.dto.ChargingStationSearchBaseDistanceResponseDto;
import com.ll.eitcharge.domain.chargingStation.chargingStation.dto.ChargingStationSearchItemResponseDto;
import com.ll.eitcharge.domain.chargingStation.chargingStation.dto.ChargingStationSearchResponseDto;
import com.ll.eitcharge.domain.chargingStation.chargingStation.entity.ChargingStation;
import com.ll.eitcharge.domain.chargingStation.chargingStation.service.ChargingStationService;
import com.ll.eitcharge.global.rsData.RsData;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping(value = "/api/v1/chargingStation", produces = APPLICATION_JSON_VALUE)
@Tag(name = "ChargingStationController", description = "충전소 컨트롤러 API")
@RequiredArgsConstructor
@Slf4j
public class ChargingStationController {

    private final ChargingStationService chargingStationService;
    private static final String DEFAULT_LAT = "37.5665"; // 종로구 서울 시청
    private static final String DEFAULT_LNG = "126.9780"; // 종로구 서울 시청

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
        // todo: 로그 지우기
        log.info("[Test] : 지도 위경도 기반 충전소 마커 요청");
        log.info("[Test] : 현재 사용중인 스레드, {}", Thread.currentThread());
        log.info("[Test] : 현재 활성화된 스레드 개수 {}개", Thread.activeCount());
        return ResponseEntity.ok(chargingStationService.findByLatBetweenAndLngBetween(swLat, swLng, neLat, neLng));
    }

    @GetMapping("/chargerStatus/fromApi")
    @Operation(summary = "충전기 상태조회", description = "충전소에 포함된 충전기들의 상태조회(공공데이터 포탈 api)")
    public RsData<Object> chargerStateApi(@RequestParam String statId) {
        return chargingStationService.findFromApi(statId);
    }

    @GetMapping("/chargerStatus")
    @Operation(summary = "충전기 상태 조회", description = "충전소에 포함된 충전기 상태조회")
    public ResponseEntity<List<ChargerStateDto>> chargerStateSearch(@RequestParam String statId) {
        return ResponseEntity.ok(chargingStationService.chargerStateSearch(statId));
    }

    @GetMapping("/info")
    @Operation(summary = "충전소 세부정보 조회", description = "충전소 세부정보 조회")
    public ResponseEntity<ChargingStationInfoResponseDto> infoSearch(@RequestParam String statId) {
        return ResponseEntity.ok(chargingStationService.infoSearch(statId));
    }

    @GetMapping("/search/item")
    public ResponseEntity<ChargingStationSearchItemResponseDto> getSearchMenuBaseItem() {
        return ResponseEntity.ok(chargingStationService.getSearchMenuBaseItem());
    }

    @GetMapping("/search/region")
    public ResponseEntity<ChargingStationSearchItemResponseDto> getSearchMenuRegionDetailItem(
            @RequestParam(value = "zcode") String zcode
    ) {
        return ResponseEntity.ok(chargingStationService.getSearchMenuRegionDetailItem(zcode));
    }

    @Operation(summary = "충전소 검색", description = "키워드 단위 충전소 검색 (Param) + 충전소 이름 순 정렬")
    @GetMapping("/searchBaseStatNm")
    public ResponseEntity<Page<ChargingStationSearchResponseDto>> searchBaseStatNm(
            // 사용제한 여부 (Y / N, Y : 제한 있음 N : 제한 없음)
            @RequestParam(value = "limitYn", defaultValue = "") String limitYn,
            // 무료 주차 (Y / N)
            @RequestParam(value = "parkingFree", defaultValue = "") String parkingFree,
            // 지역 단위 코드 (ex. 서울시 : 11 경기도 : 41 ... )
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
            @RequestParam(defaultValue = "1") int page,
            // 페이지 사이즈
            @RequestParam(defaultValue = "20") int pageSize
    ) {
        return ResponseEntity.ok(chargingStationService.searchBaseStatNm(
                limitYn, parkingFree, zcode, zscode, isPrimary, busiIds, chgerTypes, kw, page, pageSize));
    }

    @Operation(summary = "충전소 검색", description = "키워드 단위 충전소 검색 (Param) + 위치 기준 거리순 정렬")
    @GetMapping("/searchBaseDistance")
    public ResponseEntity<Page<ChargingStationSearchBaseDistanceResponseDto>> searchBaseDistance(
            // 충전소 충전 가능 여부 (Y / N, Y : 충전 가능 N : 충전 불가능)
            @RequestParam(value = "chargeable", required = false) String chargeable,
            // 사용제한 여부 (Y / N, Y : 제한 있음 N : 제한 없음)
            @RequestParam(value = "limitYn", required = false) String limitYn,
            // 무료 주차 (Y / N)
            @RequestParam(value = "parkingFree", required = false) String parkingFree,
            // 지역 단위 코드 (ex. 서울시 : 11 경기도 : 41 ... ),
            @RequestParam(value = "zcode", required = false) String zcode,
            // 지역 세부단위 코드 (ex. 종로구 : 11110, 서구 : 41130 ...)
            @RequestParam(value = "zscode", required = false) String zscode,
            // 상위 주요 기관 여부 (Y: 점유율 80% 상위 15개 기관 소속 충전소, N : 하위 기타 기관 소속 충전소)
            @RequestParam(value = "isPrimary", required = false) String isPrimary,
            // 기관 코드 (ex. 차지비 : PI)
            @RequestParam(value = "busiId", required = false) List<String> busiIds,
            // 보유 충전기 타입 (01 ~ 08)
            @RequestParam(value = "chgerType", required = false) List<String> chgerTypes,
            // 검색 키워드 (충전소명, 주소 LIKE)
            @RequestParam(value = "kw", required = false) String kw,
            // 페이지 정보 (1부터 시작)
            @RequestParam(value = "page", defaultValue = "1") int page,
            // 페이지 사이즈
            @RequestParam(value = "pageSize", defaultValue = "20") int pageSize,
            // 현 지도 중심 경도
            @RequestParam(value = "lng", defaultValue = DEFAULT_LNG) double lng,
            // 현 지도 중심 위도
            @RequestParam(value = "lat", defaultValue = DEFAULT_LAT) double lat,
            // 반경 제한 (m 단위, defaultValue: 2000km (전국 단위))
            @RequestParam(value = "range", defaultValue = "2000000") int range
    ) {
        // todo: 로그 지우기
        log.info("[Test] : 지도 검색 기반 충전소 마커 요청");
        log.info("[Test] : 현재 사용중인 스레드, {}", Thread.currentThread());
        log.info("[Test] : 현재 활성화된 스레드 개수 {}개", Thread.activeCount());
        return ResponseEntity.ok(chargingStationService.searchBaseDistance(
                chargeable, limitYn, parkingFree, zcode, zscode, isPrimary, busiIds, chgerTypes, kw, page, pageSize, lng, lat, range));
    }

}
