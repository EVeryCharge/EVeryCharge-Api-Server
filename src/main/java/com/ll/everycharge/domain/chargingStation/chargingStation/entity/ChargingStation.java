package com.ll.everycharge.domain.chargingStation.chargingStation.entity;

import static jakarta.persistence.FetchType.*;
import static lombok.AccessLevel.*;

import java.util.ArrayList;
import java.util.List;

import org.locationtech.jts.geom.Point;

import com.ll.everycharge.domain.charger.charger.entity.Charger;
import com.ll.everycharge.domain.charger.charger.form.ChargerApiItemForm;
import com.ll.everycharge.domain.operatingCompany.operatingCompany.entity.OperatingCompany;
import com.ll.everycharge.domain.region.regionDetail.entity.RegionDetail;
import com.ll.everycharge.domain.report.report.entity.Report;
import com.ll.everycharge.domain.review.review.entity.Review;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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
public class ChargingStation {
    //충전소 id
    @Id
    private String statId;
    //지역코드, 지역코드 상세
    @ManyToOne(fetch = LAZY)
    @JoinColumn(name = "zscode")
    private RegionDetail regionDetail;

    @OneToMany(mappedBy = "chargingStation")
    private List<Charger> chargers = new ArrayList<>();

    @OneToMany(mappedBy = "chargingStation")
    private List<Report> reports = new ArrayList<>();

    @OneToMany(mappedBy = "chargingStation")
    private List<Review> reviews = new ArrayList<>();

    @ManyToOne(fetch = LAZY)
    @JoinColumn(name = "busi_id")
    private OperatingCompany operatingCompany;

    //충전소명
    private String statNm;
    //주소
    private String addr;
    //상세위치
    private String location;
    //이용가능 시간
    private String useTime;
    //위도
    private double lat;
    //경도
    private double lng;
    // 위도, 경도 point
    private Point point;
    //주차료여부
    private String parkingFree;
    //충전소 안내
    private String note;
    //이용자 제한 여부
    private String limitYn;
    //이용자 제한 사유
    private String limitDetail;
    //편의제공여부
    private String trafficYn;
    //충전소 구분 코드
    private String kind;
    //충전소 구분 상세 코드
    private String kindDetail;

    // 배치 활용 로직, 인서트 시 사용 편의 생성자
    public ChargingStation(ChargerApiItemForm item, OperatingCompany company, RegionDetail regionDetail) {
        this.statId = item.getStatId();
        this.statNm = item.getStatNm();
        this.addr = item.getAddr();
        this.location = item.getLocation();
        this.useTime = item.getUseTime();
        this.lat = item.getLat();
        this.lng = item.getLng();
        this.parkingFree = item.getParkingFree();
        this.note = item.getNote();
        this.limitYn = item.getLimitYn();
        this.limitDetail = item.getLimitDetail();
        this.trafficYn = item.getTrafficYn();
        this.kind = item.getKind();
        this.kindDetail = item.getKindDetail();
        this.operatingCompany = company;
        this.regionDetail = regionDetail;
    }

    // 배치 활용 로직, 업데이트 시 사용 편의 메소드
    public void update(ChargerApiItemForm item, OperatingCompany company, RegionDetail regionDetail) {
        this.statNm = item.getStatNm();
        this.addr = item.getAddr();
        this.location = item.getLocation();
        this.useTime = item.getUseTime();
        this.lat = item.getLat();
        this.lng = item.getLng();
        this.parkingFree = item.getParkingFree();
        this.note = item.getNote();
        this.limitYn = item.getLimitYn();
        this.limitDetail = item.getLimitDetail();
        this.trafficYn = item.getTrafficYn();
        this.kind = item.getKind();
        this.kindDetail = item.getKindDetail();
        this.operatingCompany = company;
        this.regionDetail = regionDetail;
    }
}
