package com.ll.eitcharge.domain.chargingStation.chargingStation.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ChargingStationItemsDto {
    @JsonProperty("item")
    private ChargingStationItemDto[] item;
}