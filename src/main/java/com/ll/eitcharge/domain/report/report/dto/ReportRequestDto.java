package com.ll.eitcharge.domain.report.report.dto;

import org.springframework.lang.NonNull;

import com.ll.eitcharge.domain.report.report.entity.ReportType;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Getter
@Setter
public class ReportRequestDto {
	@NonNull
	private String title;

	@NonNull
	private String content;

	@NonNull
	@Builder.Default
	private String reportType = ReportType.SYSTEM_ERROR.getValue();

	@NonNull
	private String stationId;
	private String stationName;
}
