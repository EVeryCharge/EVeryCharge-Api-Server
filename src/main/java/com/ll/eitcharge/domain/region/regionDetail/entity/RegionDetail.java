package com.ll.eitcharge.domain.region.regionDetail.entity;

import com.ll.eitcharge.domain.chargingStation.chargingStation.entity.ChargingStation;
import com.ll.eitcharge.domain.region.region.entity.Region;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

import static lombok.AccessLevel.PROTECTED;

@Entity
@NoArgsConstructor(access = PROTECTED)
@AllArgsConstructor(access = PROTECTED)
@Builder
@Getter
@Table(indexes = @Index(name="idx_region_detail", columnList ="region_detail_name"))
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
