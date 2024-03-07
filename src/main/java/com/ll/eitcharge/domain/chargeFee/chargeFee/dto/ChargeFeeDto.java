package com.ll.eitcharge.domain.chargeFee.chargeFee.dto;

import com.ll.eitcharge.domain.chargeFee.chargeFee.entity.ChargeFee;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChargeFeeDto {
	private String bnm;
	private String chgerType;
	private Double memberFee;
	private Double memberFeeChange;
	private Double nonMemberFee;
	private Double nonMemberFeeChange;

	public ChargeFeeDto(ChargeFee chargeFee) {
		this.bnm = chargeFee.getBnm();
        this.chgerType = chargeFee.getChgerType();
        this.memberFee = chargeFee.getMemberFee();
        this.memberFeeChange = chargeFee.getMemberFeeChange();
        this.nonMemberFee = chargeFee.getNonMemberFee();
        this.nonMemberFeeChange = chargeFee.getNonMemberFeeChange();
	}
}