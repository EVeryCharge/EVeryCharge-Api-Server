package com.ll.eitcharge.domain.chargeFee.chargeFee.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ll.eitcharge.domain.chargeFee.chargeFee.dto.ChargeFeeListDto;
import com.ll.eitcharge.domain.chargeFee.chargeFee.dto.ChargeFeeSearchBaseItemDto;
import com.ll.eitcharge.domain.chargeFee.chargeFee.service.ChargeFeeService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/chargeFee")
public class ChargeFeeController {
	private final ChargeFeeService chargeFeeService;

	@GetMapping
	public ResponseEntity<ChargeFeeListDto> showSearchResult(
		@RequestParam(value = "bnm", required = false) List<String> bnm,
		@RequestParam(value ="chgerType", required = false) String chgerType
	) {
		return ResponseEntity.ok(chargeFeeService.getChargeFee(bnm, chgerType));
	}

	@GetMapping("/item")
	public ResponseEntity<ChargeFeeSearchBaseItemDto> getSearchBaseItem() {
		return ResponseEntity.ok(chargeFeeService.getSearchBaseItem());
	}

	@GetMapping("/roaming")
	public String showRoamingSearchResult() {
		return "success";
	}

	@GetMapping("roaming/item")
	public String getRoamingSearchBaseItem() {
		// chargeFeeService.getRoamingSearchBaseItem();
		return "success";
	}
}
