package com.ll.eitcharge.domain.technicalManager.technicalManager.entity;


import com.ll.eitcharge.domain.station.station.entity.Station;
import jakarta.persistence.*;
import lombok.*;

import static jakarta.persistence.FetchType.*;
import static lombok.AccessLevel.PROTECTED;

@Entity
@NoArgsConstructor(access = PROTECTED)
@AllArgsConstructor(access = PROTECTED)
@Builder
@Getter
@Setter
public class TechnicalManager {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = LAZY)
    private Station station;

    private String name;
    private String field;
}
