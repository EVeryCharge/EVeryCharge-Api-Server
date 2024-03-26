package com.ll.everycharge.domain.charger.charger.dto;

import java.time.LocalDateTime;

import com.ll.everycharge.domain.charger.charger.entity.Charger;

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
