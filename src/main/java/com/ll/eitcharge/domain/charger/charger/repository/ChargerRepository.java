package com.ll.eitcharge.domain.charger.charger.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ll.eitcharge.domain.charger.charger.entity.Charger;
import com.ll.eitcharge.domain.charger.chargerState.form.ChargerStateUpdateForm;

@Repository
public interface ChargerRepository extends JpaRepository<Charger, Long> {
    List<Charger> findByChargingStationStatId(String statId);

    //statId와 chrgerId를 기반으로 charger를 찾는 메서드
    Optional<Charger> findByChargingStationStatIdAndChgerId(String statId, String chgerId);

    @Modifying(clearAutomatically = true)
    @Query("UPDATE Charger c " +
        "SET c.stat = :#{#charger.stat}, " +
        "    c.statUpdDt = :#{#charger.statUpdDt}, " +
        "    c.lastTsdt = :#{#charger.lastTsdt}, " +
        "    c.lastTedt = :#{#charger.lastTedt}, " +
        "    c.nowTsdt = :#{#charger.nowTsdt} " +
        "WHERE c.chgerId = :#{#charger.chgerId} AND c.chargingStation.statId = :#{#charger.statId}")
    int updateChargerState(@Param("charger") ChargerStateUpdateForm charger);
}
