package com.ll.eitcharge.domain.mypage.car.controller;

import com.ll.eitcharge.domain.chargeFee.chargeFee.dto.ChargeFeeSearchBaseItemDto;
import com.ll.eitcharge.domain.mypage.car.dto.CarDto;
import com.ll.eitcharge.domain.mypage.car.dto.CarListDto;
import com.ll.eitcharge.domain.mypage.car.dto.CarManufacturerDto;
import com.ll.eitcharge.domain.mypage.car.service.CarService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import static org.springframework.util.MimeTypeUtils.APPLICATION_JSON_VALUE;

@RestController
@RequestMapping(value = "/api/v1/car", produces = APPLICATION_JSON_VALUE)
@Tag(name = "CarController", description = "전기차 정보 컨트롤러 API")
@RequiredArgsConstructor
public class CarController {
    private final CarService carService;

    @GetMapping("/carInfo")
    public ResponseEntity<CarDto> getCarInfo(
            @RequestParam(value = "carModel") String carModel
    ) {
        return ResponseEntity.ok(carService.getCarInfo(carModel));
    }
    @GetMapping("/carInfoAll")
    public ResponseEntity<CarListDto> getCarInfoAll() {
        return ResponseEntity.ok(carService.getCarInfoAll());
    }

    @GetMapping("/manuAll")
    public ResponseEntity<CarManufacturerDto> getCarManuAll() {
        return ResponseEntity.ok(carService.getCarManuAll());
    }

    @GetMapping("/findByManu")
    public ResponseEntity<CarListDto> getCarFindByManu(
            @RequestParam(value = "manu") String manu
    ) {
        return ResponseEntity.ok(carService.getCarByManu(manu));
    }
}
