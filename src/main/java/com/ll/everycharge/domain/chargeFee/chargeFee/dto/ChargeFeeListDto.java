package com.ll.everycharge.domain.chargeFee.chargeFee.dto;

import java.util.List;

import com.ll.everycharge.domain.chargeFee.chargeFee.entity.ChargeFee;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChargeFeeListDto {
	private List<ChargeFeeDto> chargeFeeDtoList;

	public ChargeFeeListDto(List<ChargeFee> chargeFeeList) {
		this.chargeFeeDtoList = chargeFeeList.stream()
			.map(ChargeFeeDto::new)
			.toList();
	}
}
