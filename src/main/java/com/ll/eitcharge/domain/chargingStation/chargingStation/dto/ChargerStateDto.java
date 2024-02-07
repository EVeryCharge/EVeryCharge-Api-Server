package com.ll.eitcharge.domain.chargingStation.chargingStation.dto;

import com.ll.eitcharge.domain.charger.charger.entity.Charger;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class ChargerStateDto {
    private Long id;
    private String chgerId;
    private String chgerType;
    private String stat;
    private LocalDateTime statUpdDt;
    private LocalDateTime lastTsdt;
    private LocalDateTime lastTedt;
    private LocalDateTime nowTsdt;
    private String output;
    private String method;
    private String useTime;

    public ChargerStateDto(Charger charger) {
        this.id = charger.getId();
        this.chgerId = charger.getChgerId();
        this.chgerType = charger.getChgerType();
        this.stat = charger.getStat();
        this.statUpdDt = charger.getStatUpdDt();
        this.lastTsdt = charger.getLastTsdt();
        this.lastTedt = charger.getLastTedt();
        this.nowTsdt = charger.getNowTsdt();
        this.output = charger.getOutput();
        this.method = charger.getMethod();
        this.useTime = charger.getChargingStation().getUseTime();
    }
}
