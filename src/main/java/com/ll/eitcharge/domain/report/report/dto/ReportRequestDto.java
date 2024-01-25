package com.ll.eitcharge.domain.report.report.dto;

import static lombok.AccessLevel.*;

import org.springframework.lang.NonNull;

import com.ll.eitcharge.domain.report.report.entity.ReportType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor(access = PROTECTED)
@AllArgsConstructor(access = PROTECTED)
public class ReportRequestDto {
	@NonNull
	private String title;

	@NonNull
	private String content;

	@NonNull
	@Builder.Default
	private String reportType = ReportType.SYSTEM_ERROR.getValue();

	@NonNull
	private String statId;
	private String statNm;
}
