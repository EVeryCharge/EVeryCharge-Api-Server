package com.ll.eitcharge.domain.report.report.entity;

import static jakarta.persistence.FetchType.*;
import static lombok.AccessLevel.*;

import java.time.LocalDateTime;

import com.ll.eitcharge.domain.chargingStation.chargingStation.entity.ChargingStation;
import com.ll.eitcharge.domain.member.member.entity.Member;
import com.ll.eitcharge.domain.technicalManager.technicalManager.entity.TechnicalManager;
import com.ll.eitcharge.global.jpa.entity.BaseTime;

import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@NoArgsConstructor(access = PROTECTED)
@AllArgsConstructor(access = PROTECTED)
@Builder(toBuilder = true)
@Getter
@Setter
public class Report extends BaseTime {
	@ManyToOne(fetch = LAZY)
	private ChargingStation chargingStation;

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
