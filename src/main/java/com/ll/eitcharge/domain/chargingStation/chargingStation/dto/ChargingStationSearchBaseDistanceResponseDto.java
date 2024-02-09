package com.ll.eitcharge.domain.chargingStation.chargingStation.dto;

import java.util.Arrays;
import java.util.List;

import groovy.transform.Immutable;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Immutable
public class ChargingStationSearchBaseDistanceResponseDto {

	private String statId;
	private String distance;
	private String statNm;
	private String addr;
	private double lat;
	private double lng;
	private String bnm;
	private boolean parkingFree;
	private boolean limitYn;
	private List<String> chgerTypes;

	public ChargingStationSearchBaseDistanceResponseDto(
		String statId, double distance, String statNm, String addr, double lat, double lng, String bnm,
		String parkingFree, String limitYn, String chgerTypes
	) {
		this.statId = statId;
		this.distance = formatDistance(distance);
		this.statNm = statNm;
		this.addr = (addr == null ? "주소지 없음" : addr);
		this.lat = lat;
		this.lng = lng;
		this.bnm = bnm;
		this.parkingFree = parkingFree.contentEquals("Y");
		this.limitYn = limitYn.contentEquals("Y");
		this.chgerTypes = chgerTypes == null ? null : Arrays.stream(chgerTypes.split(","))
			.sorted()
			.toList();
	}

	private String formatDistance(double distance) {
		return String.format("%.1fkm", distance / 1000);
	}
}
