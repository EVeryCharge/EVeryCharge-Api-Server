package com.ll.eitcharge.domain.station.station.entity;

import com.ll.eitcharge.domain.agency.agency.entity.Agency;
import com.ll.eitcharge.domain.localArea.localArea.entity.LocalArea;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

import static jakarta.persistence.FetchType.*;
import static lombok.AccessLevel.PROTECTED;

@Entity
@NoArgsConstructor(access = PROTECTED)
@AllArgsConstructor(access = PROTECTED)
@Builder
@Getter
@Setter
public class Station {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = LAZY)
    private LocalArea localArea;

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
