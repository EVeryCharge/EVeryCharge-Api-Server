package com.ll.eitcharge.domain.charger.update.chargerState.service;

import org.springframework.context.annotation.Configuration;

import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class ChargerStateUpdateConfig {
	public static boolean isUpdateRunning = false;
}
