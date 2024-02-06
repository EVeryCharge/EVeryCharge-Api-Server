package com.ll.eitcharge.domain.chargingStation.chargingStation.dto;

import java.util.Arrays;
import java.util.List;

import com.ll.eitcharge.domain.charger.charger.entity.ChargerType;

import lombok.Getter;

@Getter
public class ChargingStationSearchItemResponseDto {
	private List<String> zcodes;
	private List<String> regionNames;
	private List<String> zscodes;
	private List<String> regionDetialNames;
	private List<String> busiIds;
	private List<String> bnms;
	private List<String> chgerIds;
	private List<String> chgerTypes;

	public ChargingStationSearchItemResponseDto(
		List<String> zcodes,
		List<String> regionNames,
		List<String> busiIds,
		List<String> bnms,
		ChargerType[] chgerTypes
	) {
		this.zcodes = zcodes;
		this.regionNames = regionNames;
		this.busiIds = busiIds;
		this.bnms = bnms;
		this.chgerIds = Arrays.stream(chgerTypes)
			.map(c -> Integer.toString(c.getNumber()))
			.toList();
		this.chgerTypes = Arrays.stream(chgerTypes)
			.map(ChargerType::getValue)
			.toList();
	}

	public ChargingStationSearchItemResponseDto(List<String> zscodes, List<String> regionDetialNames) {
		this.zscodes = zscodes;
		this.regionDetialNames = regionDetialNames;
	}
}
