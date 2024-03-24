package com.ll.eitcharge.domain.mypage.car.service;

import com.ll.eitcharge.domain.mypage.car.dto.CarDto;
import com.ll.eitcharge.domain.mypage.car.dto.CarListDto;
import com.ll.eitcharge.domain.mypage.car.dto.CarManufacturerDto;
import com.ll.eitcharge.domain.mypage.car.repository.CarRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CarService {
    private final CarRepository carRepository;
    public CarDto getCarInfo(String carModel) {
        return new CarDto(carRepository.findByCarModel(carModel)) ;
    }

    public CarListDto getCarInfoAll() {
        return new CarListDto(carRepository.findAll()) ;
    }

    public CarManufacturerDto getCarManuAll() {
        return new CarManufacturerDto(carRepository.findAll());
    }

    public CarListDto getCarByManu(String manu) {
        return new CarListDto(carRepository.findByManufacturer(manu));
    }
}
