package com.ll.eitcharge.domain.report.report.dto;

import com.ll.eitcharge.domain.report.report.entity.Report;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.lang.NonNull;

import java.time.LocalDateTime;

import static lombok.AccessLevel.PROTECTED;

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

	//TODO 충전소 id String으로 변경. 그에따른 작업 부탁드립니다
	@NonNull
	private String stationId;

	@NonNull
	private String stationName;

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
		this.stationId = report.getChargingStation().getStatId();
		this.stationName = report.getChargingStation().getStatNm();
		this.isCompleted = report.isCompleted();
		this.replierName = report.getReplier().getName();
		this.reply = report.getReply();
		this.replyCreatedDate = report.getReplyCreatedDate();
	}
}
