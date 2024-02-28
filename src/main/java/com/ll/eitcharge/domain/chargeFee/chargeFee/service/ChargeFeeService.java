package com.ll.eitcharge.domain.chargeFee.chargeFee.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aspose.cells.SaveFormat;
import com.aspose.cells.Workbook;
import com.aspose.cells.Worksheet;
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
			String bnmData = rowData.get(0);
			String chgerTypeData = rowData.get(1);
			Double memberFeeData = Double.parseDouble(rowData.get(2));
			Double nonMemberFeeData = Double.parseDouble(rowData.get(3));

			switch (bnmData) {
				case "GS차지비" -> bnmData = "차지비";
				case "채비" -> bnmData = "대영채비";
				case "이브이시스" -> bnmData = "중앙제어";
				case "투이스이브이씨" -> bnmData = "삼성EVC";
			}

			Optional<OperatingCompany> opCompany = operatingCompanyService.findByBnmOptional(bnmData);
			if (opCompany.isEmpty()) continue;

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
		workbook.dispose();
	}

	@Scheduled(cron = "0 0 2 * * * ")
	public void updateChargeRoamingFeeFileFromApi() {
		Workbook workbook = excelDataUtil.getDataByWorkbook(CHARGE_ROAMING_FEE_API_URL);
		try {
			workbook.save(CHARGE_ROAMING_FEE_FILE_PATH, SaveFormat.XLSX);
		} catch (Exception e) {
			log.error("ERROR : 로밍요금 xlsx 저장 실패");
			e.printStackTrace();
		}
	}
}