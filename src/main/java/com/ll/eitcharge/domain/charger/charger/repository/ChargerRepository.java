package com.ll.eitcharge.domain.charger.charger.repository;

import com.ll.eitcharge.domain.charger.charger.entity.Charger;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChargerRepository extends JpaRepository<Charger, Long> {
    List<Charger> findByChargingStationStatId(String statId);



}
