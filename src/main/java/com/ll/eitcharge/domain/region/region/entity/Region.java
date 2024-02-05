package com.ll.eitcharge.domain.region.region.entity;

import jakarta.persistence.*;
import lombok.*;

import static lombok.AccessLevel.PROTECTED;

@Entity
@NoArgsConstructor(access = PROTECTED)
@AllArgsConstructor(access = PROTECTED)
@Builder
@Getter
@Table(indexes = @Index(name="idx_region", columnList ="region_name"))
public class Region {
    @Id
    private String zcode;

    @Column(unique = true)
    private String regionName;
}
