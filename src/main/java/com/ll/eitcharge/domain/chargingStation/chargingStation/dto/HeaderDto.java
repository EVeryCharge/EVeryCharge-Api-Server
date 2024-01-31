package com.ll.eitcharge.domain.chargingStation.chargingStation.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class HeaderDto {
    private String resultCode;
    private String resultMsg;
    private int totalCount;
    private int pageNo;
    private int numOfRows;
}
