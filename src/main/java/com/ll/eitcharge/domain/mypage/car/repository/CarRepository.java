package com.ll.eitcharge.domain.mypage.car.repository;

import com.ll.eitcharge.domain.mypage.car.dto.CarDto;
import com.ll.eitcharge.domain.mypage.car.entity.Car;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CarRepository extends JpaRepository<Car, Long> {
    Car findByCarModel(String carModel);

    List<Car> findByManufacturer(String manu);
}
