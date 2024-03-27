package com.ll.everycharge.domain.chargeFee.chargeFee.dto;

import java.util.List;

import com.ll.everycharge.domain.chargeFee.chargeFee.entity.ChargeFee;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChargeFeeSearchBaseItemDto {
	List<String> bnmList;

	public ChargeFeeSearchBaseItemDto(List<ChargeFee> chargeFeeList) {
		bnmList = chargeFeeList.stream()
			.map(ChargeFee::getBnm)
			.distinct()
			.toList();
	}
}
