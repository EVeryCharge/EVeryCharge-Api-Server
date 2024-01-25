package com.ll.eitcharge.domain.region.region.entity;

import com.ll.eitcharge.domain.chargingStation.chargingStation.entity.ChargingStation;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.*;

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
    private String zcode;
    @Id
    private String zscode;

    @OneToMany(mappedBy = "region")
    private List<ChargingStation> chargingStations = new ArrayList<>();

    private String regionName;

}
