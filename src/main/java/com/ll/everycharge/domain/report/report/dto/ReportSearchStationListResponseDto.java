package com.ll.everycharge.domain.report.report.dto;

import java.util.List;

import org.springframework.lang.NonNull;

import com.ll.everycharge.domain.chargingStation.chargingStation.entity.ChargingStation;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReportSearchStationListResponseDto {
	@NonNull
	private String keyword;

	private List<ReportSearchStationDto> chargingStations;

	private String errorMsg;

	public ReportSearchStationListResponseDto(List<ChargingStation> chargingStations, String keyword) {
		this.keyword = keyword;
		if (chargingStations.isEmpty()) {
			this.errorMsg = "검색 결과가 없습니다";
			return;
		}
		this.chargingStations = chargingStations.stream()
			.map(ReportSearchStationDto::new)
			.toList();
    }
}
