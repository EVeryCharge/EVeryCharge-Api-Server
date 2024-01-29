package com.ll.eitcharge.domain.region.regionDetail.entity;

import com.ll.eitcharge.domain.chargingStation.chargingStation.entity.ChargingStation;
import com.ll.eitcharge.domain.region.region.entity.Region;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
public class RegionDetail {
    @Id
    private String zscode;
    @ManyToOne
    @JoinColumn(name = "zcode")
    private Region zcode;
    private String regionDetailName;

    @OneToMany(mappedBy = "regionDetail")
    private List<ChargingStation> chargingStations = new ArrayList<>();
}
