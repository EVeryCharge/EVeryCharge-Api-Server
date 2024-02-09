package com.ll.eitcharge.domain.charger.charger.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ChargerType {
	TYPE_2(2, "완속 / AC"),
	TYPE_8(8, "완속 / DC 콤보"),
	TYPE_1(1, "급속 차데모"),
	TYPE_3(3, "급속 / DC 차데모, AC 3상"),
	TYPE_4(4, "급속 / DC 콤보"),
	TYPE_5(5, "급속 / DC 차데모, DC 콤보"),
	TYPE_6(6, "급속 / DC 차데모, AC 3상, DC 콤보"),
	TYPE_7(7, "급속 / AC 3상");
	// TYPE_9(89, "H2");

	private final int number;
	private final String value;
}