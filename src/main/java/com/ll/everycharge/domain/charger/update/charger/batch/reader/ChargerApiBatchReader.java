package com.ll.everycharge.domain.charger.update.charger.batch.reader;

import static com.ll.everycharge.global.app.AppConfig.*;

import java.util.List;

import org.springframework.batch.core.configuration.annotation.StepScope;
import org.springframework.batch.item.ItemReader;
import org.springframework.stereotype.Component;

import com.ll.everycharge.domain.charger.charger.form.ChargerApiItemForm;
import com.ll.everycharge.domain.charger.charger.service.ChargerService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@StepScope
@Slf4j
@RequiredArgsConstructor
public class ChargerApiBatchReader implements ItemReader<List<ChargerApiItemForm>> {
	private final ChargerService chargerService;
	private int currentPageNo = 1;
	private final int numOfRows = 1000;
	private final String baseUrl = "https://apis.data.go.kr/B552584/EvCharger/getChargerInfo";
	private final String dataType = "JSON";

	@Override
	public List<ChargerApiItemForm> read() {
		List<ChargerApiItemForm> list = chargerService.webClientApiGetChargerInfo(
			baseUrl, apiServiceKey, numOfRows,currentPageNo, dataType);

		log.info("[Batch] : 현재 불러온 OpenAPI 데이터 페이지 : {} 페이지", currentPageNo);

		if (list.isEmpty()) {
			log.info("[Batch] : Step 단위 Reader 불러오기 종료, 총 페이지 : {} 페이지", currentPageNo);
			return null;
		}

		currentPageNo++;
		return list;
	}
}
