package com.ll.eitcharge.global.initData;

import java.util.stream.IntStream;
import java.util.stream.LongStream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.context.annotation.Profile;
import org.springframework.core.annotation.Order;
import org.springframework.transaction.annotation.Transactional;

import com.ll.eitcharge.domain.chargingStation.chargingStation.entity.ChargingStation;
import com.ll.eitcharge.domain.chargingStation.chargingStation.service.ChargingStationService;
import com.ll.eitcharge.domain.member.member.entity.Member;
import com.ll.eitcharge.domain.member.member.service.MemberService;
import com.ll.eitcharge.domain.report.report.dto.ReportRequestDto;
import com.ll.eitcharge.domain.report.report.dto.ReportResultRequestDto;
import com.ll.eitcharge.domain.report.report.entity.ReportType;
import com.ll.eitcharge.domain.report.report.service.ReportService;
import com.ll.eitcharge.domain.technicalManager.technicalManager.service.TechnicalManagerService;
import com.ll.eitcharge.global.rsData.RsData;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

//프로필이 dev일 때만 실행하고 member를 10명 생성
@Configuration
@Profile("dev")
@Slf4j
@RequiredArgsConstructor
public class Dev {
	@Autowired
	@Lazy
	private Dev self;
	private final ReportService reportService;
	private final MemberService memberService;
	private final ChargingStationService chargingStationService;
	private final TechnicalManagerService technicalManagerService;

	@Bean
	@Order(3)
	public ApplicationRunner initNotProd() {
		return args -> {
			self.makeTestUser();
			self.makeTestChargingStation();
			self.makeTestTechnicalManager();
			self.makeTestReport();
			self.makeTestReportResult();
		};

	}

	@Transactional
	public void makeTestUser() {
		// 이미 회원이 존재하는 경우 초기화를 수행하지 않음
		if (memberService.findByUsername("user1").isPresent())
			return;
		//유저 10명 생성
		//스트림으로 우아하게 바꿔줘
		IntStream.rangeClosed(1, 10).forEach(i -> {
			memberService.join("user" + i, "123");
		});
	}

	public void makeTestChargingStation() {
		if (chargingStationService.findByStatIdOptional("99999991").isPresent())
			return;
		chargingStationService.create("99999991", "TestChargingStation1");
	}

	public void makeTestTechnicalManager() {
		if (memberService.findByUsername("manager1").isPresent())
			return;
		RsData<Member> memberRsData = memberService.join("manager1", "123");

		technicalManagerService.create(memberRsData.getData(), chargingStationService.findByStatId("99999991"));
	}

	// 신고내역 샘플 데이터
	public void makeTestReport() {
		if (reportService.findByIdOptional(1L).isPresent())
			return;
		ChargingStation chargingStation = chargingStationService.findByStatId("99999991");

		IntStream.rangeClosed(1, 20).forEach(i -> {
				ReportRequestDto requestDto = ReportRequestDto.builder()
					.title(String.format("테스트 신고 %d", i))
					.content(String.format("테스트 신고 내용 %d", i))
					.reportType(ReportType.SYSTEM_ERROR.getValue())
					.statId(chargingStation.getStatId())
					.statNm(chargingStation.getStatNm())
					.build();
				reportService.create(requestDto, "user1");
			}
		);
	}

	// 신고 처리결과 샘플 데이터
	public void makeTestReportResult() {
		if (reportService.findById(1L).getReplier() != null)
			return;
		LongStream.rangeClosed(1L, 10L).forEach(i -> {
				ReportResultRequestDto requestDto = ReportResultRequestDto.builder()
					.reply(String.format("테스트 처리 결과 %d", i))
					.build();
				 reportService.complete(requestDto, i, "manager1");
			}
		);
	}
}
