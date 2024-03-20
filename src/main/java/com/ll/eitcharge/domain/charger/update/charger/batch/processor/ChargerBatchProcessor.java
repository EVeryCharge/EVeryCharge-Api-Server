package com.ll.eitcharge.domain.charger.update.charger.batch.processor;

import java.util.List;

import org.springframework.batch.core.configuration.annotation.StepScope;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.stereotype.Component;

import com.ll.eitcharge.domain.charger.charger.form.ChargerApiItemForm;
import com.ll.eitcharge.domain.region.regionDetail.repository.RegionDetailRepository;

import lombok.RequiredArgsConstructor;

@Component
@StepScope
@RequiredArgsConstructor
public class ChargerBatchProcessor implements ItemProcessor<List<ChargerApiItemForm>, List<ChargerApiItemForm>> {
	private final RegionDetailRepository regionDetailRepository;
	@Override
	public List<ChargerApiItemForm> process(List<ChargerApiItemForm> items) {
		return items.stream()
			.filter(this::isValidItem)
			.toList();
	}

	private boolean isValidItem(ChargerApiItemForm item) {
		// 비즈니스 로직 상 유효하지 않은 값일 시 필터
		return item.getStatId() != null && !item.getStatId().isEmpty() &&
			item.getStatNm() != null && !item.getStatNm().isEmpty() &&
			item.getLat() != null && item.getLng() != null &&
			item.getChgerId() != null && !item.getChgerId().isEmpty() &&
			item.getChgerType() != null && !item.getChgerType().isEmpty() &&
			item.getZcode() != null && !item.getZcode().isEmpty() &&
			item.getZscode() != null && !item.getZscode().isEmpty() &&
			item.getBusiId() != null && !item.getBusiId().isEmpty() &&
			item.getBnm() != null && !item.getBnm().isEmpty() &&
			// 불변 데이터 지역코드도 존재하는 지 확인
			regionDetailRepository.existsById(item.getZscode());
	}
}
