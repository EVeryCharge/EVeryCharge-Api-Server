package com.ll.eitcharge.domain.chargingStation.chargingStation.dto;

import com.ll.eitcharge.domain.charger.charger.entity.Charger;
import com.ll.eitcharge.domain.chargingStation.chargingStation.entity.ChargingStation;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;


public class ChargerStateDto {

    private Long id;
    private Long chargerType;
    private Long stat;
    private String useTime;
    private String statUpdDt;
    private String startTsdt;
    private String endTsdt;
    private String nowTsdt;
    private String output;
    private String method;
    private Boolean delYn;

    public ChargerStateDto(Charger charger) {
        this.id = charger.getId();
        this.chargerType = charger.getChargerType();
        this.stat = charger.getStat();
        this.useTime = charger.getUseTime();
        this.statUpdDt = charger.getStatUpdDt();
        this.startTsdt = charger.getStartTsdt();
        this.endTsdt = charger.getEndTsdt();
        this.nowTsdt = charger.getNowTsdt();
        this.output = charger.getOutput();
        this.method = charger.getMethod();
        this.delYn = charger.getDelYn();
    }
}
