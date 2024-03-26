package com.ll.everycharge.domain.chargingStation.chargingStation.dto;

import java.util.Arrays;
import java.util.List;

import com.ll.everycharge.domain.charger.charger.entity.ChargerType;

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
	private List<String> ranges;
	private List<String> rangeNames;

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
		this.ranges = List.of("2000", "3000", "5000", "10000", "30000", "50000");
		this.rangeNames = List.of("2km", "3km", "5km", "10km", "30km",	"50km");
	}


	public ChargingStationSearchItemResponseDto(List<String> zscodes, List<String> regionDetialNames) {
		this.zscodes = zscodes;
		this.regionDetialNames = regionDetialNames;
	}
}
