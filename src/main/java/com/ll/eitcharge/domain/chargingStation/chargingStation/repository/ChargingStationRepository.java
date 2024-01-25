package com.ll.eitcharge.domain.chargingStation.chargingStation.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ll.eitcharge.domain.chargingStation.chargingStation.entity.ChargingStation;

@Repository
public interface ChargingStationRepository extends JpaRepository<ChargingStation, Long> {
}
