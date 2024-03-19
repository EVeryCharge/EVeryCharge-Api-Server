package com.ll.eitcharge.domain.mypage.car.dto;

import com.ll.eitcharge.domain.mypage.car.entity.Car;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.stream.Collectors;


@Getter
@Setter
public class CarManufacturerDto {
    private List<String> CarManufacturerList;

    public CarManufacturerDto(List<Car> carList) {
        this.CarManufacturerList = carList.stream()
                .map(Car::getManufacturer)
                .distinct()  // 중복 제조사 제거
                .collect(Collectors.toList());
    }
}
