package com.ll.eitcharge.domain.operatingCompany.operatingCompany.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import static lombok.AccessLevel.PROTECTED;

@Entity
@NoArgsConstructor(access = PROTECTED)
@AllArgsConstructor(access = PROTECTED)
@Builder
@Getter
@Table(indexes = @Index(name="idx_operating_company", columnList ="bnm"))
public class OperatingCompany {
    @Id
    //기관 아이디
    private String busiId;
    //기관명
    private String bnm;
    //점유율 상위 15개 기관 여부
    private String isPrimary;
}
