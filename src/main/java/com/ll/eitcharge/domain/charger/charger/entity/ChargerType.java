package com.ll.eitcharge.domain.charger.charger.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ChargerType {
	TYPE_1(1, "DC 차데모"),
	TYPE_2(2, "AC 완속"),
	TYPE_3(3, "DC 차데모, AC 3상"),
	TYPE_4(4, "DC 콤보"),
	TYPE_5(5, "DC 차데모, DC 콤보"),
	TYPE_6(6, "DC 차데모, AC 3상, DC 콤보"),
	TYPE_7(7, "AC 3상"),
	TYPE_8(8, "DC 콤보(완속)");
	// TYPE_9(89, "H2");

	private final int number;
	private final String value;
}