package com.ll.eitcharge.domain.charger.charger.entity;


import com.ll.eitcharge.domain.chargingStation.chargingStation.entity.ChargingStation;
import jakarta.persistence.*;
import lombok.*;

import static lombok.AccessLevel.PROTECTED;

@Entity
@NoArgsConstructor(access = PROTECTED)
@AllArgsConstructor(access = PROTECTED)
@Builder
@Getter
@Setter
public class Charger {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "station_id")
    private ChargingStation chargingStation;

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

}
