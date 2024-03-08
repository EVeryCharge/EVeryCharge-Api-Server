package com.ll.eitcharge.domain.chargeFee.chargeFee.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ChargeRoamingFeeSearchBaseItemDto {
	List<String> memberBnmList;
	List<String> chargerBnmList;
}
