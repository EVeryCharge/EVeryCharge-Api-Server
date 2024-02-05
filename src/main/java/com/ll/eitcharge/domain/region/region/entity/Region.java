package com.ll.eitcharge.domain.region.region.entity;

import jakarta.persistence.*;
import lombok.*;

import static lombok.AccessLevel.PROTECTED;

@Entity
@NoArgsConstructor(access = PROTECTED)
@AllArgsConstructor(access = PROTECTED)
@Builder
@Getter
public class Region {
    @Id
    private String zcode;

    @Column(unique = true)
    private String regionName;
}
