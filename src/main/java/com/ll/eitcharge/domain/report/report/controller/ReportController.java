package com.ll.eitcharge.domain.report.report.controller;

import static org.springframework.util.MimeTypeUtils.*;

import java.security.Principal;

import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ll.eitcharge.domain.report.report.dto.ReportCompleteRequestDto;
import com.ll.eitcharge.domain.report.report.dto.ReportRequestDto;
import com.ll.eitcharge.domain.report.report.dto.ReportResponseDto;
import com.ll.eitcharge.domain.report.report.dto.ReportSearchStationListResponseDto;
import com.ll.eitcharge.domain.report.report.service.ReportService;
import com.ll.eitcharge.global.rsData.RsData;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;

/**
 * 작성자: 이상제
 */
@RestController
@RequestMapping(value = "/api/v1/reports", produces = APPLICATION_JSON_VALUE)
@Tag(name = "ReportController", description = "신고내역 컨트롤러 API")
@RequiredArgsConstructor
public class ReportController {
	private final ReportService reportService;

	@GetMapping("/list")
	public RsData<Page<ReportResponseDto>> getList(
		@RequestParam(value="page", defaultValue = "0") int page,
		@RequestParam(value="pageSize", defaultValue = "10") int pageSize
	) {

		Page<ReportResponseDto> responseDtos = reportService.getList(page, pageSize);
		responseDtos.getContent().forEach(this::loadReportAccess);

		return RsData.of("200", "ok", responseDtos);
	}

	@GetMapping("/{id}")
	public RsData<ReportResponseDto> get(@PathVariable(value = "id") Long id) {

		ReportResponseDto responseDto = reportService.get(id);
		loadReportAccess(responseDto);
		return RsData.of("200", "ok", responseDto);
	}


	@Operation(description = "신고내역 작성 시 충전소 검색(키워드: 충전소명, 지역명, 세부지역명)")
	@GetMapping("/station")
	public RsData<ReportSearchStationListResponseDto> getStationList(@RequestParam(value = "kw") String kw) {
		return RsData.of("200", "ok", reportService.getStationList(kw));
	}

	@PreAuthorize("isAuthenticated()")
	@PostMapping("")
	public RsData<ReportResponseDto> write(
		@RequestBody @NonNull ReportRequestDto requestDto,
		Principal principal) {

		ReportResponseDto responseDto = reportService.create(requestDto, principal.getName());
		loadReportAccess(responseDto);
		return RsData.of("200", "ok", responseDto);
	}

	@PreAuthorize("isAuthenticated()")
	@PutMapping("/{id}")
	public RsData<ReportResponseDto> modify(
		@PathVariable(value = "id") Long id,
		@RequestBody @NonNull ReportRequestDto requestDto
		, Principal principal) {

		ReportResponseDto responseDto = reportService.update(requestDto, id, principal.getName());
		loadReportAccess(responseDto);
		return RsData.of("200", "ok", responseDto);
	}

	@PreAuthorize("isAuthenticated()")
	@DeleteMapping("/{id}")
	public RsData<ReportResponseDto> delete(
		@PathVariable(value = "id") Long id,
		Principal principal) {

		reportService.delete(id, principal.getName());
        return RsData.of("200", "ok");
    }

	@PreAuthorize("isAuthenticated()")
	@PutMapping("/{id}/complete")
    public RsData<ReportResponseDto> complete(
        @PathVariable(value = "id") Long id,
        @RequestBody @NonNull ReportCompleteRequestDto requestDto
        , Principal principal) {

		ReportResponseDto responseDto = reportService.complete(requestDto, id, principal.getName());
		loadReportAccess(responseDto);
		return RsData.of("200", "ok", responseDto);
	}

	private void loadReportAccess(ReportResponseDto responseDto) {
		reportService.loadReportAccess(responseDto);
	}
}
