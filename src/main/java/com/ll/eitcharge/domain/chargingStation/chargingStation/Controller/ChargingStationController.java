package com.ll.eitcharge.domain.chargingStation.chargingStation.Controller;

import com.ll.eitcharge.domain.chargingStation.chargingStation.dto.ChargingStationSearchResponseDto;
import com.ll.eitcharge.domain.chargingStation.chargingStation.entity.ChargingStation;
import com.ll.eitcharge.domain.chargingStation.chargingStation.service.ChargingStationService;
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
    public ResponseEntity<List<ChargingStationSearchResponseDto>> searchStation(
            @RequestParam double swLat,
            @RequestParam double swLng,
            @RequestParam double neLat,
            @RequestParam double neLng
    ) {
        return ResponseEntity.ok(chargingStationService.findByLatBetweenAndLngBetween(swLat, swLng, neLat, neLng));
    }
}
