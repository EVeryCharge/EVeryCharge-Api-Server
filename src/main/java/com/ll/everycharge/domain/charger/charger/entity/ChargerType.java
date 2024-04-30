package com.ll.everycharge.domain.charger.charger.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ChargerType {
	TYPE_7("07", "AC3상"),
	TYPE_2("02", "AC완속"),
	TYPE_4("04", "DC콤보"),
	TYPE_1("01", "DC차데모"),
	TYPE_3("03", "DC차데모 + AC3상"),
	TYPE_5("05", "DC차데모 + DC콤보"),
	TYPE_6("06", "DC차데모 + AC3상 + DC콤보");

	private final String number;
	private final String value;
}