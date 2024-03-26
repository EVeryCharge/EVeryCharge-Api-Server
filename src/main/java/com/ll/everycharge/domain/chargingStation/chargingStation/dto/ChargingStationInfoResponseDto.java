package com.ll.everycharge.domain.chargingStation.chargingStation.dto;

import java.util.List;

import com.ll.everycharge.domain.chargeFee.chargeFee.dto.ChargeFeeDto;
import com.ll.everycharge.domain.chargeFee.chargeFee.entity.ChargeFee;
import com.ll.everycharge.domain.chargingStation.chargingStation.entity.ChargingStation;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChargingStationInfoResponseDto {
	private String statId;
	private String statNm;
	private String addr;
	private String useTime;
	private String busiId;
	private String bnm;
	private String parkingFree;
	private String limitYn;
	private String limitDetail;
	private List<ChargeFeeDto> chargeFeeList;

	public ChargingStationInfoResponseDto(ChargingStation chargingStation, List<ChargeFee> chargeFeeList) {
		this.statId = chargingStation.getStatId();
		this.statNm = chargingStation.getStatNm();
		this.addr = chargingStation.getAddr();
		this.useTime = chargingStation.getUseTime();
		this.busiId = chargingStation.getOperatingCompany().getBusiId();
		this.bnm = chargingStation.getOperatingCompany().getBnm();
		this.parkingFree = chargingStation.getParkingFree();
		this.limitYn = chargingStation.getLimitYn();
		this.limitDetail = chargingStation.getLimitDetail();
		this.chargeFeeList = chargeFeeList.stream().map(ChargeFeeDto::new).toList();
	}
}
