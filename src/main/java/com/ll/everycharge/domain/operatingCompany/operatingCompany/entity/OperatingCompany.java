package com.ll.everycharge.domain.operatingCompany.operatingCompany.entity;

import static lombok.AccessLevel.*;

import java.util.ArrayList;
import java.util.List;

import com.ll.everycharge.domain.chargingStation.chargingStation.entity.ChargingStation;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor(access = PROTECTED)
@AllArgsConstructor(access = PROTECTED)
@Builder
@Getter
public class OperatingCompany {
    @Id
    //기관 아이디
    private String busiId;
    //기관명
    private String bnm;
    //점유율 상위 15개 기관 여부
    private String isPrimary;

    @OneToMany(mappedBy = "operatingCompany")
    private List<ChargingStation> chargingStations = new ArrayList<>();
}
