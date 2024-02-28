package com.ll.eitcharge.domain.chargeFee.chargeFee.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ll.eitcharge.domain.chargeFee.chargeFee.service.ChargeFeeService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/chargeFee")
public class ChargeFeeController {
	private final ChargeFeeService chargeFeeService;

	@GetMapping("/test")
	public String test() {
		chargeFeeService.updateChargeRoamingFeeFileFromApi();
		return "success";
	}
}
