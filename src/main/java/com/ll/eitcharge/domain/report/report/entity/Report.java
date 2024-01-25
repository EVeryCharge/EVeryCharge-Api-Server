package com.ll.eitcharge.domain.report.report.entity;

import com.ll.eitcharge.domain.chargingStation.chargingStation.entity.ChargingStation;
import com.ll.eitcharge.domain.member.member.entity.Member;
import com.ll.eitcharge.domain.technicalManager.technicalManager.entity.TechnicalManager;
import com.ll.eitcharge.global.jpa.entity.BaseTime;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import lombok.*;

import java.time.LocalDateTime;

import static jakarta.persistence.FetchType.LAZY;
import static lombok.AccessLevel.PROTECTED;

@Entity
@NoArgsConstructor(access = PROTECTED)
@AllArgsConstructor(access = PROTECTED)
@Builder(toBuilder = true)
@Getter
@Setter
public class Report extends BaseTime {
	@ManyToOne(fetch = LAZY)
	private ChargingStation chargingStation;

	//TODO author에서 member로 변경했습니다
	@ManyToOne(fetch = LAZY)
	private Member member;

	private String title;
	private String content;
	private String reportType;

	@ManyToOne(fetch = LAZY)
	private TechnicalManager replier;
	private boolean isCompleted;
	private String reply;
	private LocalDateTime replyCreatedDate;
}
