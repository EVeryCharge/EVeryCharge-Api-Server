package com.ll.eitcharge.domain.charger.update.charger.batch.reader;

import static com.ll.eitcharge.global.app.AppConfig.*;

import java.util.List;

import org.springframework.batch.core.configuration.annotation.StepScope;
import org.springframework.batch.item.ItemReader;
import org.springframework.stereotype.Component;

import com.ll.eitcharge.domain.charger.charger.form.ChargerApiItemForm;
import com.ll.eitcharge.domain.charger.charger.service.ChargerService;

import lombok.RequiredArgsConstructor;

@Component
@StepScope
@RequiredArgsConstructor
public class ChargerApiBatchReader implements ItemReader<List<ChargerApiItemForm>> {
	private final ChargerService chargerService;
	private int currentIndex = 1;
	private final int numOfRows = 1000;
	private final String baseUrl = "https://apis.data.go.kr/B552584/EvCharger/getChargerInfo";
	private final String dataType = "JSON";

	@Override
	public List<ChargerApiItemForm> read() {
		List<ChargerApiItemForm> list = chargerService.webClientApiGetChargerInfo(baseUrl, apiServiceKey, numOfRows, currentIndex, dataType);
		currentIndex++;

		if (list.isEmpty()) return null;
		return list;
	}
}
