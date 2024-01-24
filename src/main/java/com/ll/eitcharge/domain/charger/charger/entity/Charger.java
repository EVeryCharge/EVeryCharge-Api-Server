package com.ll.eitcharge.domain.charger.charger.entity;


import com.ll.eitcharge.domain.station.station.entity.Station;
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
    private Station station;

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
