package com.ll.eitcharge.domain.chargingStation.chargingStation.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.domain.Page;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ChargingStationSearchResponseDtoWithExecuteTime {
    private String executionTimeResult;
    private Page<ChargingStationSearchResponseDto> chargingStationResponseDtoPage;
}