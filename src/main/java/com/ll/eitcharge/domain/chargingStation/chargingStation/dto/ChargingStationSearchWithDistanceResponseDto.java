package com.ll.eitcharge.domain.chargingStation.chargingStation.dto;

import com.ll.eitcharge.domain.chargingStation.chargingStation.entity.ChargingStation;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ChargingStationSearchWithDistanceResponseDto extends ChargingStationSearchResponseDto {
	private double distance;

	// todo: 성능 개선 목적 join이 필요한 필드는 줄이는 것 고려
	public ChargingStationSearchWithDistanceResponseDto(ChargingStation chargingStation) {
        super(chargingStation);
    }
	public ChargingStationSearchWithDistanceResponseDto(ChargingStation chargingStation, double distance) {
		super(chargingStation);
		this.distance = distance;
	}
}
