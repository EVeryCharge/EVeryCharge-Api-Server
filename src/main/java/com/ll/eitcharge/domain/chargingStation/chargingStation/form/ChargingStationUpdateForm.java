package com.ll.eitcharge.domain.chargingStation.chargingStation.form;

import com.ll.eitcharge.domain.charger.charger.form.ChargerApiItemForm;

import lombok.Getter;

@Getter
public class ChargingStationUpdateForm {
	private String statId;
	private String statNm;
	private String addr;
	private String location;
	private String useTime;
	private Double lat;
	private Double lng;
	private String parkingFree;
	private String note;
	private String limitYn;
	private String limitDetail;
	private String delYn;
	private String delDetail;
	private String trafficYn;
	private String kind;
	private String kindDetail;
	private String busiId;
	private String zscode;

	public ChargingStationUpdateForm(ChargerApiItemForm item) {
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
		this.delYn = item.getDelYn();
		this.delDetail = item.getDelDetail();
		this.trafficYn = item.getTrafficYn();
		this.kind = item.getKind();
		this.kindDetail = item.getKindDetail();
		this.busiId = item.getBusiId();
		this.zscode = item.getZscode().substring(0, 4) + "0";
	}
}

