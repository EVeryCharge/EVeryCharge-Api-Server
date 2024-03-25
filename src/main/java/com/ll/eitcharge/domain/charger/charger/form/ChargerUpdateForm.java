package com.ll.eitcharge.domain.charger.charger.form;

import java.time.LocalDateTime;

import lombok.Getter;

@Getter
public class ChargerUpdateForm {
	private String chgerId;
	private String chgerType;
	private String stat;
	private LocalDateTime statUpdDt;
	private LocalDateTime lastTsdt;
	private LocalDateTime lastTedt;
	private LocalDateTime nowTsdt;
	private String output;
	private String method;
	private String statId;

	public ChargerUpdateForm(ChargerApiItemForm item) {
        this.chgerType = item.getChgerType();
        this.stat = item.getStat();
        this.statUpdDt = item.getStatUpdDt();
        this.lastTsdt = item.getLastTsdt();
        this.lastTedt = item.getLastTedt();
        this.nowTsdt = item.getNowTsdt();
        this.output = item.getOutput();
        this.method = item.getMethod();
		this.chgerId = item.getChgerId();
        this.statId = item.getStatId();
	}
}
