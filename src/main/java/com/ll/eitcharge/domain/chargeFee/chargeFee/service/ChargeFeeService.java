package com.ll.eitcharge.domain.chargeFee.chargeFee.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aspose.cells.Cells;
import com.aspose.cells.SaveFormat;
import com.aspose.cells.Workbook;
import com.aspose.cells.Worksheet;
import com.ll.eitcharge.domain.chargeFee.chargeFee.dto.ChargeFeeListDto;
import com.ll.eitcharge.domain.chargeFee.chargeFee.dto.ChargeFeeSearchBaseItemDto;
import com.ll.eitcharge.domain.chargeFee.chargeFee.dto.ChargeRoamingFeeListDto;
import com.ll.eitcharge.domain.chargeFee.chargeFee.dto.ChargeRoamingFeeSearchBaseItemDto;
import com.ll.eitcharge.domain.chargeFee.chargeFee.entity.ChargeFee;
import com.ll.eitcharge.domain.chargeFee.chargeFee.repository.ChargeFeeRepository;
import com.ll.eitcharge.domain.operatingCompany.operatingCompany.entity.OperatingCompany;
import com.ll.eitcharge.domain.operatingCompany.operatingCompany.service.OperatingCompanyService;
import com.ll.eitcharge.standard.util.ExcelDataUtil;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ChargeFeeService {
	private final OperatingCompanyService operatingCompanyService;
	private final ChargeFeeRepository chargeFeeRepository;
	private final ExcelDataUtil excelDataUtil;
	private final String CHARGE_FEE_API_URL = "https://ev.or.kr/nportal/evcarInfo/selectEvcarStationPriceExcel.do";
	private final String CHARGE_ROAMING_FEE_API_URL = "https://ev.or.kr/nportal/evcarInfo/selectChrgeFeeStatusExcel.do";
	private final String CHARGE_ROAMING_FEE_FILE_PATH = "src/main/resources/xls/charging_roaming_fee.xlsx";

	// 엔티티 조회용
	public Optional<ChargeFee> findByBnmAndChgerTypeOptional(String bnm, String chgerType) {
		return chargeFeeRepository.findByBnmAndChgerType(bnm, chgerType);
	}

	public List<ChargeFee> findByBnm(String bnm) {
		return chargeFeeRepository.findByBnm(bnm);
	}


	@Scheduled(cron = "0 0 2 * * * ")
	@Transactional
	public void upsertChargeFeeFromApi() {
		Workbook workbook = excelDataUtil.getDataByWorkbook(CHARGE_FEE_API_URL);
		if (workbook == null) return;

		Worksheet worksheet = workbook.getWorksheets().get(0);
		int lastRow = worksheet.getCells().getMaxDataRow();
		int lastCol = worksheet.getCells().getMaxDataColumn();

		for (int row = 3; row <= lastRow; row++) {
			List<String> rowData = new ArrayList<>();
			for (int col = 1; col <= lastCol; col++) {
				// 리스트 {기관명, 충전타입(구분), 회원가, 비회원가}
				rowData.add(worksheet.getCells().get(row, col).getStringValue());
			}
			upsertRowData(rowData);
		}
		// 요금 미공시 업체 데이터 업데이트(별도 크롤링) TODO 크롤링 방안 마련
		upsertRowData(List.of("한국전력", "급속", "324.4", "324.4"));
		upsertRowData(List.of("한국전력", "완속", "347.2", "347.2"));
		upsertRowData(List.of("에스트래픽", "급속", "385.0", "520.0"));
		upsertRowData(List.of("에스트래픽", "완속", "288.0", "520.0"));

		workbook.dispose();
	}

	@Transactional
	public void upsertRowData(List<String> rowData) {
		String bnmData = rowData.get(0);
		String chgerTypeData = rowData.get(1);
		Double memberFeeData = Double.parseDouble(rowData.get(2));
		Double nonMemberFeeData = Double.parseDouble(rowData.get(3));

		// 현재 엔티티 내 기관 (OperatingCompany) 명과 맞게 업체명 수정
		switch (bnmData) {
			case "GS차지비" -> bnmData = "차지비";
			case "채비" -> bnmData = "대영채비";
			case "이브이시스" -> bnmData = "중앙제어";
			case "투이스이브이씨" -> bnmData = "삼성EVC";
		}

		Optional<OperatingCompany> opCompany = operatingCompanyService.findByBnmOptional(bnmData);
		if (opCompany.isEmpty()) return;

		Optional<ChargeFee> opChargeFee = findByBnmAndChgerTypeOptional(bnmData, chgerTypeData);
		if (opChargeFee.isPresent()) {
			ChargeFee chargeFee = opChargeFee.get();
			chargeFee.update(chgerTypeData, memberFeeData, nonMemberFeeData, chargeFee.getMemberFee(),
				chargeFee.getNonMemberFee());
		}
		if (opChargeFee.isEmpty()) {
			ChargeFee chargeFee = ChargeFee.builder()
				.operatingCompany(opCompany.get())
				.bnm(bnmData)
				.chgerType(chgerTypeData)
				.memberFee(memberFeeData)
				.nonMemberFee(nonMemberFeeData)
				.build();
			chargeFeeRepository.save(chargeFee);
		}
	}

	@Scheduled(cron = "0 0 2 * * * ")
	public void updateChargeRoamingFeeFileFromApi() {
		Workbook workbook = excelDataUtil.getDataByWorkbook(CHARGE_ROAMING_FEE_API_URL);
		if (workbook == null) return;
		try {
			workbook.save(CHARGE_ROAMING_FEE_FILE_PATH, SaveFormat.XLSX);
		} catch (Exception e) {
			log.error("ERROR : 로밍요금 xlsx 저장 실패");
			e.printStackTrace();
		}
	}

	public ChargeFeeSearchBaseItemDto getSearchBaseItem() {
		return new ChargeFeeSearchBaseItemDto(chargeFeeRepository.findAll());
	}

	public ChargeFeeListDto getChargeFee(List<String> bnms, String chgerType) {
		return new ChargeFeeListDto(chargeFeeRepository.findAllByBnmsAndChgerType(bnms, chgerType));
	}

	public ChargeRoamingFeeSearchBaseItemDto getRoamingSearchBaseItem() {
		Workbook workbook = excelDataUtil.readDataByWorkbook(CHARGE_ROAMING_FEE_FILE_PATH);
		Worksheet worksheet = workbook.getWorksheets().get(0);
		int lastRow = worksheet.getCells().getMaxDataRow();
		int lastCol = worksheet.getCells().getMaxDataColumn();

		List<String> memberBnmList = new ArrayList<>();
		for (int row = 1; row <= lastRow; row++) {
			String cellValue = worksheet.getCells().get(row, 0).getStringValue().trim();
			if (!cellValue.isEmpty()) {
				memberBnmList.add(cellValue);
			}
		}

		List<String> chargerBnmList = new ArrayList<>();
		for (int col = 1; col <= lastCol; col++) {
			String cellValue = worksheet.getCells().get(0, col).getStringValue().trim();
			if (!cellValue.isEmpty()) {
				chargerBnmList.add(cellValue);
			}
		}

		return new ChargeRoamingFeeSearchBaseItemDto(memberBnmList, chargerBnmList);
	}

	public ChargeRoamingFeeListDto getChargeRoamingFee(List<String> memberBnm, List<String> chgerBnm) {
		Workbook workbook = excelDataUtil.readDataByWorkbook(CHARGE_ROAMING_FEE_FILE_PATH);
		String[][] values = new String[memberBnm.size() + 1][chgerBnm.size() + 1];

		// A1 셀 값 설정
		values[0][0] = "회원 / 충전기";

		// memberBnm 값 설정 (표의 기준 행)
		for (int i = 0; i < memberBnm.size(); i++) {
			values[i + 1][0] = memberBnm.get(i);
		}

		// chgerBnm 값 설정 (표의 기준 열)
		for (int j = 0; j < chgerBnm.size(); j++) {
			values[0][j + 1] = chgerBnm.get(j);
		}

		// 나머지 셀 값 설정
		for (int i = 0; i < memberBnm.size(); i++) {
			for (int j = 0; j < chgerBnm.size(); j++) {
				String cellValue = getCellValueFromWorkbook(workbook, memberBnm.get(i), chgerBnm.get(j));
				values[i + 1][j + 1] = cellValue;
			}
		}

		return new ChargeRoamingFeeListDto(values);
	}

	// 기준 행열을 제외한 검색 필터에 따른 셀 값을 선택하는 로직
	private String getCellValueFromWorkbook(Workbook workbook, String memberBnm, String chgerBnm) {
		Worksheet worksheet = workbook.getWorksheets().get(0);
		Cells cells = worksheet.getCells();

		// 회원 / 충전기가 있는 첫 번째 열과 행 인덱스
		int memberRowIndex = 0;
		int chgerColIndex = 0;

		// 회원 / 충전기가 있는 행과 열 인덱스 찾기
		for (int row = 0; row <= cells.getMaxDataRow(); row++) {
			if (cells.get(row, 0).getStringValue().equals(memberBnm)) {
				memberRowIndex = row;
				break;
			}
		}

		for (int col = 0; col <= cells.getMaxDataColumn(); col++) {
			if (cells.get(0, col).getStringValue().equals(chgerBnm)) {
				chgerColIndex = col;
				break;
			}
		}

		// 셀 내 값 가져오기
		return cells.get(memberRowIndex, chgerColIndex).getStringValue();
	}
}