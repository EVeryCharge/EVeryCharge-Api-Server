package com.ll.eitcharge.domain.report.report.entity;

import static lombok.AccessLevel.*;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor(access = PROTECTED)
public enum ReportType {

	SYSTEM_FIX("수리보수"),
	CHANGE_INFO("정보변경"),
	ETC("기타");

	private final String value;
}
