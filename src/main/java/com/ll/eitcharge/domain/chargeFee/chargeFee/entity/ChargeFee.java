package com.ll.eitcharge.domain.chargeFee.chargeFee.entity;

import static jakarta.persistence.FetchType.*;
import static lombok.AccessLevel.*;

import com.ll.eitcharge.domain.operatingCompany.operatingCompany.entity.OperatingCompany;
import com.ll.eitcharge.global.jpa.entity.BaseTime;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@Builder
@NoArgsConstructor(access = PROTECTED)
@AllArgsConstructor(access = PROTECTED)
public class ChargeFee extends BaseTime {
	@ManyToOne(fetch = LAZY)
	@JoinColumn(name = "busi_id")
	private OperatingCompany operatingCompany;
	private String bnm;
	private String chgerType;
	// 현재 요금
	private Double memberFee;
	private Double nonMemberFee;
	// 이전 요금
	private Double prevMemberFee;
	private Double prevNonMemberFee;
	// 요금 변동금액
	private Double memberFeeChange;
	private Double nonMemberFeeChange;

	public void update(String chgerType, Double newMemberFee, Double newNonMemberFee, Double prevMemberFee,
		Double prevNonMemberFee) {
		this.chgerType = chgerType;
		this.memberFee = newMemberFee;
		this.nonMemberFee = newNonMemberFee;
		if (this.prevMemberFee == null || !this.prevMemberFee.equals(this.memberFee))
			this.prevMemberFee = this.memberFee;
		if (this.prevNonMemberFee == null || !this.prevNonMemberFee.equals(this.nonMemberFee))
			this.prevNonMemberFee = this.nonMemberFee;
		this.memberFeeChange = newMemberFee - prevMemberFee;
		this.nonMemberFeeChange = newNonMemberFee - prevNonMemberFee;
	}
}
