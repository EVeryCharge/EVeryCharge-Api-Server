package com.ll.everycharge.domain.report.report.dto;

import org.springframework.data.domain.Page;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReportPageResponseDto {
	private boolean actorCanCreate;
	private Page<ReportResponseDto> page;

	public ReportPageResponseDto(Page<ReportResponseDto> page) {
        this.page = page;
    }
}
