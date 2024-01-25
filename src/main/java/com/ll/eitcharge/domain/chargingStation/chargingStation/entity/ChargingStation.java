package com.ll.eitcharge.domain.chargingStation.chargingStation.entity;

import com.ll.eitcharge.domain.agency.agency.entity.Agency;
import com.ll.eitcharge.domain.charger.charger.entity.Charger;
import com.ll.eitcharge.domain.region.region.entity.Region;
import com.ll.eitcharge.domain.report.report.entity.Report;
import com.ll.eitcharge.domain.review.review.entity.Review;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static jakarta.persistence.FetchType.*;
import static lombok.AccessLevel.PROTECTED;

@Entity
@NoArgsConstructor(access = PROTECTED)
@AllArgsConstructor(access = PROTECTED)
@Builder
@Getter
@Setter
public class ChargingStation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = LAZY)
    @JoinColumn(name = "region_code")
    private Region region;

    @OneToMany(mappedBy = "chargingStation")
    private List< Charger > chargers = new ArrayList<>();

    @OneToMany(mappedBy = "chargingStation")
    private List< Report > reports = new ArrayList<>();

    @OneToMany(mappedBy = "chargingStation")
    private List< Review > reviews = new ArrayList<>();

    @ManyToOne(fetch = LAZY)
    private Agency agency;

    private String chargerType;
    private String state;
    private LocalDateTime useTime;
    private LocalDateTime startChargingDate;
    private LocalDateTime endChargingDate;
    private LocalDateTime nowChargingDate;
    private String output;
    private String method;
    private boolean delYn;


}
