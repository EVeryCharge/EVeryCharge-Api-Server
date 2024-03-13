package com.ll.eitcharge.domain.charger.chargerState.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ChargerStateUpdateDto {
	private String statId;
	private String chgerId;
	private String stat;
	private LocalDateTime statUpdDt;
	private LocalDateTime lastTsdt;
	private LocalDateTime lastTedt;
	private LocalDateTime nowTsdt;
}
