package com.ll.everycharge.domain.mypage.car.dto;

import com.ll.everycharge.domain.mypage.car.entity.Car;
import lombok.Getter;
import lombok.Setter;

import java.util.List;


@Getter
@Setter
public class CarListDto {
    private List<CarDto> CarDtoList;

    public CarListDto(List<Car> carList) {
        this.CarDtoList = carList.stream()
                .map(CarDto::new)
                .toList();
    }
}
