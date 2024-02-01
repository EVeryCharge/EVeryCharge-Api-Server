package com.ll.eitcharge.domain.report.report.dto;

import org.springframework.lang.NonNull;

import com.ll.eitcharge.domain.chargingStation.chargingStation.entity.ChargingStation;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor(access = AccessLevel.PROTECTED)
public class ReportSearchStationDto {
	@NonNull
	String statId;

	String statNm;

	String addr;

	public ReportSearchStationDto(ChargingStation chargingStation) {
        this.statId = chargingStation.getStatId();
        this.statNm = chargingStation.getStatNm();
		this.addr = chargingStation.getAddr();
    }
}
