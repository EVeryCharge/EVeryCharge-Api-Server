package com.ll.eitcharge.domain.region.region.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
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

    private String regionName;

}
