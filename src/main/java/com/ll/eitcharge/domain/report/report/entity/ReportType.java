package com.ll.eitcharge.domain.report.report.entity;

import static lombok.AccessLevel.*;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor(access = PROTECTED)
public enum ReportType {

	SYSTEM_ERROR("장애내용"),
	GIVE_INFO("정보변경");

	private final String value;
}
