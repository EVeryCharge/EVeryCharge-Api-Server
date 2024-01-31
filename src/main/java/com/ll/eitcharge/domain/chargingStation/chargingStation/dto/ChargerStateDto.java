package com.ll.eitcharge.domain.chargingStation.chargingStation.dto;

import java.time.LocalDateTime;

import com.ll.eitcharge.domain.charger.charger.entity.Charger;

import lombok.Getter;
import lombok.Setter;

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
    }
}
