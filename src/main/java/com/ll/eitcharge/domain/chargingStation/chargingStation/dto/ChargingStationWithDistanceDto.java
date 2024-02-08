package com.ll.eitcharge.domain.chargingStation.chargingStation.dto;

import groovy.transform.Immutable;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Immutable
public class ChargingStationWithDistanceDto {
	private String id;
	private double distance;

	public ChargingStationWithDistanceDto(String id, double distance) {
		this.id = id;
		this.distance = distance;
	}
}
