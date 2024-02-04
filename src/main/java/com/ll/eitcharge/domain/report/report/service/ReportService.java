package com.ll.eitcharge.domain.report.report.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ll.eitcharge.domain.chargingStation.chargingStation.service.ChargingStationService;
import com.ll.eitcharge.domain.member.member.entity.Member;
import com.ll.eitcharge.domain.member.member.service.MemberService;
import com.ll.eitcharge.domain.report.report.dto.ReportCompleteRequestDto;
import com.ll.eitcharge.domain.report.report.dto.ReportRequestDto;
import com.ll.eitcharge.domain.report.report.dto.ReportResponseDto;
import com.ll.eitcharge.domain.report.report.dto.ReportSearchStationListResponseDto;
import com.ll.eitcharge.domain.report.report.entity.Report;
import com.ll.eitcharge.domain.report.report.repository.ReportRepository;
import com.ll.eitcharge.domain.technicalManager.technicalManager.entity.TechnicalManager;
import com.ll.eitcharge.domain.technicalManager.technicalManager.service.TechnicalManagerService;
import com.ll.eitcharge.global.exceptions.GlobalException;
import com.ll.eitcharge.global.rq.Rq;

import lombok.RequiredArgsConstructor;

/**
 * 작성자: 이상제
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReportService {
	private final ReportRepository reportRepository;
	private final MemberService memberService;
	private final ChargingStationService chargingStationService;
	private final TechnicalManagerService technicalManagerService;
	private final Rq rq;

	public Page<ReportResponseDto> getList(int page, int pageSize) {
		List<Sort.Order> sorts = new ArrayList<>();
		sorts.add(Sort.Order.desc("id"));

		Pageable pageable = PageRequest.of(page, pageSize, Sort.by(sorts));
		Page<Report> reportPage = reportRepository.findAll(pageable);

		return reportPage.map(ReportResponseDto::new);
	}

	public ReportResponseDto get(Long id) {
		return new ReportResponseDto(
			reportRepository.findById(id).orElseThrow(
				GlobalException.E404::new
			)
		);
	}
	public ReportSearchStationListResponseDto getStationList(String keyword) {
		return new ReportSearchStationListResponseDto(chargingStationService.findByReportEditKw(keyword), keyword);
	}

	//서비스 레이어 간 엔티티 조회용
	public Report findById(Long id) {
		return reportRepository.findById(id).orElseThrow(GlobalException.E404::new);
	}

	public Optional<Report> findByIdOptional(Long id) {
		return reportRepository.findById(id);
	}

	@Transactional
	public ReportResponseDto create(ReportRequestDto requestDto, String username) {
		Report report = Report.builder()
			.chargingStation(chargingStationService.findById(requestDto.getStatId()))
			.member(memberService.findByUsername(username).orElseThrow(GlobalException.E404::new))
			.title(requestDto.getTitle())
			.content(requestDto.getContent())
			.reportType(requestDto.getReportType())
			.completed(false)
			.build();

		reportRepository.save(report);
		return new ReportResponseDto(report);
	}

	@Transactional
	public ReportResponseDto update(ReportRequestDto requestDto, Long reportId, String username) {
		Report report = findById(reportId);
		if (!report.getMember().getUsername().equals(username)) {
			throw new GlobalException.E403();
		}

		report.update(requestDto, chargingStationService.findById(requestDto.getStatId()));
		return new ReportResponseDto(report);
	}

	@Transactional
	public void delete(Long reportId, String username) {
		Report report = findById(reportId);
		if (!report.getMember().getUsername().equals(username)) {
			throw new GlobalException.E403();
		}

		reportRepository.delete(report);
	}

	@Transactional
	public ReportResponseDto complete(ReportCompleteRequestDto requestDto, Long reportId, String username) {
		Report report = findById(reportId);
		TechnicalManager manager = technicalManagerService.findByName(username);

		if (!manager.getChargingStation().equals(report.getChargingStation())) {
			throw new GlobalException.E403();
		}
		if (report.isCompleted()) {
			throw new GlobalException("이미 처리가 완료된 신고내용입니다.");
		}

		report.complete(requestDto, manager);
		return new ReportResponseDto(report);
	}

	public void loadReportAccess(ReportResponseDto dto) {
		Member actor = rq.getMember();
			dto.setActorCanRead(canRead(dto));
			dto.setActorCanManagerSearch(canManagerSearch(actor));
			dto.setActorCanCreate(canCreate(actor));
			dto.setActorCanEdit(canEdit(actor, dto));
			dto.setActorCanComplete(canComplete(actor, dto));
	}

	public boolean canRead(ReportResponseDto dto) {
		return dto != null;
	}

	public boolean canCreate(Member actor) {
		return actor != null;
	}

	public boolean canEdit(Member actor, ReportResponseDto dto) {
		if (dto == null) { return false; }
        if (actor == null) { return false; }
		if (dto.isCompleted()) { return false; }

		return actor.getId().equals(dto.getMemberId());
	}

	public boolean canComplete(Member actor, ReportResponseDto dto) {
		if (dto == null) { return false; }
		if (dto.isCompleted()) { return false; }
        if (actor == null) { return false; }
		if (actor.getTechnicalManager() == null) { return false; }
		if (actor.getTechnicalManager().getChargingStation() == null) { return false;}

		return (actor.getTechnicalManager().getChargingStation().getStatId().equals(dto.getStatId()));
	}

	public boolean canManagerSearch(Member actor) {
		if (actor == null) { return false; }
		if (actor.getTechnicalManager() == null) { return false; }

		return (actor.getTechnicalManager().getChargingStation() != null);
	}
}
