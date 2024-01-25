package com.ll.eitcharge.domain.report.report.dto;

import static lombok.AccessLevel.*;

import java.time.LocalDateTime;

import org.springframework.lang.NonNull;

import com.ll.eitcharge.domain.report.report.entity.Report;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = PROTECTED)
public class ReportResponseDto {
	@NonNull
	private Long id;

	@NonNull
	private String title;

	@NonNull
	private String content;

	@NonNull
	private String reportType;

	@NonNull
	private LocalDateTime createDate;

	private LocalDateTime modifyDate;

	@NonNull
	private Long authorId;

	@NonNull
	private String authorName;

	@NonNull
	private String statId;

	@NonNull
	private String statName;

	@NonNull
	private boolean isCompleted;

	private String replierName;

    private String reply;

	private LocalDateTime replyCreatedDate;

	public ReportResponseDto(Report report) {
		this.id = report.getId();
		this.title = report.getTitle();
		this.content = report.getContent();
		this.reportType = report.getReportType();
		this.createDate = report.getCreatedDate();
		this.modifyDate = report.getModifiedDate();
		this.authorId = report.getMember().getId();
		this.authorName = report.getMember().getName();
		this.statId = report.getChargingStation().getStatId();
		this.statName = report.getChargingStation().getStatNm();
		this.isCompleted = report.isCompleted();
		this.replierName = report.getReplier().getName();
		this.reply = report.getReply();
		this.replyCreatedDate = report.getReplyCreatedDate();
	}
}
