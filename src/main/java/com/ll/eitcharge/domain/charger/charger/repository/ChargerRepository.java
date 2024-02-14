package com.ll.eitcharge.domain.charger.charger.repository;

import com.ll.eitcharge.domain.charger.charger.entity.Charger;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChargerRepository extends JpaRepository<Charger, Long> {
    List<Charger> findByChargingStationStatId(String statId);

    //statId와 chrgerId를 기반으로 charger를 찾는 메서드
    Optional<Charger> findByChargingStationStatIdAndChgerId(String statId, String chgerId);


}
