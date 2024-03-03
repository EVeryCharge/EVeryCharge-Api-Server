package com.ll.eitcharge.domain.chargeFee.chargeFee.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ll.eitcharge.domain.chargeFee.chargeFee.dto.ChargeFeeListDto;
import com.ll.eitcharge.domain.chargeFee.chargeFee.dto.ChargeRoamingFeeListDto;
import com.ll.eitcharge.domain.chargeFee.chargeFee.dto.ChargeRoamingFeeSearchBaseItemDto;
import com.ll.eitcharge.domain.chargeFee.chargeFee.dto.ChargeFeeSearchBaseItemDto;
import com.ll.eitcharge.domain.chargeFee.chargeFee.service.ChargeFeeService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/chargeFeeInfo")
public class ChargeFeeController {
	private final ChargeFeeService chargeFeeService;

	@GetMapping
	public ResponseEntity<ChargeFeeListDto> showSearchResult(
		@RequestParam(value = "bnm", required = false) List<String> bnm,
		@RequestParam(value = "chgerType", required = false) String chgerType
	) {
		return ResponseEntity.ok(chargeFeeService.getChargeFee(bnm, chgerType));
	}

	@GetMapping("/item")
	public ResponseEntity<ChargeFeeSearchBaseItemDto> getSearchBaseItem() {
		return ResponseEntity.ok(chargeFeeService.getSearchBaseItem());
	}

	@GetMapping("/roaming")
	public ResponseEntity<ChargeRoamingFeeListDto> showRoamingSearchResult(
		@RequestParam(value = "memberBnm", required = true) List<String> memberBnm,
		@RequestParam(value = "chgerBnm", required = true) List<String> chgerBnm) {
		return ResponseEntity.ok(chargeFeeService.getChargeRoamingFee(memberBnm, chgerBnm));
	}

	@GetMapping("/roaming/item")
	public ResponseEntity<ChargeRoamingFeeSearchBaseItemDto> getRoamingSearchBaseItem() {
		return ResponseEntity.ok(chargeFeeService.getRoamingSearchBaseItem());
	}
}
