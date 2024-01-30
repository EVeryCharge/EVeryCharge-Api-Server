package com.ll.eitcharge.domain.chargingStation.chargingStation.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChargingStationResponseDto {
    private List<HeaderDto> header;
    private List<ChargingStationItemDto> items;
}



/*
"resultMsg" :...
"totalCount": ...
"items" ...
"pageNo" ,
"resultCode" ..
"numOfRows" ..
 */