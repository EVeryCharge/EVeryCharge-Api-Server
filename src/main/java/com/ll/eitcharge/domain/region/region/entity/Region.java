package com.ll.eitcharge.domain.region.region.entity;

import com.ll.eitcharge.domain.chargingStation.chargingStation.entity.ChargingStation;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static lombok.AccessLevel.PROTECTED;

@Entity
@NoArgsConstructor(access = PROTECTED)
@AllArgsConstructor(access = PROTECTED)
@Builder
@Getter
@Setter
public class Region {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToMany(mappedBy = "region")
    private List< ChargingStation > chargingStations = new ArrayList<>();

    private int zsCode;
    private String name;
    private LocalDateTime createdDate;
    private LocalDateTime modifiedDate;

}
