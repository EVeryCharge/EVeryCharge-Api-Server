package com.ll.everycharge.domain.charger.charger.form;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ChargerStateUpdateForm {
	private String statId;
	private String chgerId;
	private String stat;
	private LocalDateTime statUpdDt;
	private LocalDateTime lastTsdt;
	private LocalDateTime lastTedt;
	private LocalDateTime nowTsdt;
}
