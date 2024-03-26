package com.ll.everycharge.domain.mypage.car.repository;

import com.ll.everycharge.domain.mypage.car.entity.Car;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CarRepository extends JpaRepository<Car, Long> {
    Car findByCarModel(String carModel);

    List<Car> findByManufacturer(String manu);
}
