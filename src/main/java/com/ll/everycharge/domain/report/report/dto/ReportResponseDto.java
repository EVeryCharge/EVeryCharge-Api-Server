package com.ll.everycharge.domain.report.report.dto;

import java.time.LocalDateTime;

import org.springframework.lang.NonNull;

import com.ll.everycharge.domain.report.report.entity.Report;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
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
	private Long memberId;
	@NonNull
	private String memberName;
	@NonNull
	private String statId;
	@NonNull
	private String statNm;
	@NonNull
	private String addr;
	@NonNull
	private boolean completed;

	// 답변 관련 필드
	private String replierName;
    private String reply;
	private LocalDateTime replyCreatedDate;

	// 접근 권한 관련 필드
	private boolean actorCanRead;
	private boolean actorCanManagerSearch;
	private boolean actorCanCreate;
    private boolean actorCanEdit;
    private boolean actorCanComplete;

	public ReportResponseDto(Report report) {
		this.id = report.getId();
		this.title = report.getTitle();
		this.content = report.getContent();
		this.reportType = report.getReportType();
		this.createDate = report.getCreatedDate();
		this.modifyDate = report.getModifiedDate();
		this.memberId = report.getMember().getId();
		this.memberName = report.getMember().getName();
		this.statId = report.getChargingStation().getStatId();
		this.statNm = report.getChargingStation().getStatNm();
		this.addr = report.getChargingStation().getAddr();
		this.completed = report.isCompleted();
		// 신고 처리결과 관련 필드는 유지보수자 처리(매핑) 전까지는 null
		if (report.getReplier() != null) {
			this.replierName = report.getReplier().getName();
			this.reply = report.getReply();
			this.replyCreatedDate = report.getReplyCreatedDate();
		}
	}
}
