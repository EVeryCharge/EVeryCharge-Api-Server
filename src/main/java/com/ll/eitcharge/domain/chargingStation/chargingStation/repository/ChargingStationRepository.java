package com.ll.eitcharge.domain.chargingStation.chargingStation.repository;

import com.ll.eitcharge.domain.chargingStation.chargingStation.entity.ChargingStation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChargingStationRepository extends JpaRepository<ChargingStation, String> {
    List<ChargingStation> findByLatBetweenAndLngBetween(double swLat, double swLng, double neLat, double neLng);
}
