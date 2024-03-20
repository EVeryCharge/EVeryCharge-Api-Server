package com.ll.eitcharge.domain.charger.update.charger.batch.processor;

import java.util.List;

import org.springframework.batch.core.configuration.annotation.StepScope;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.stereotype.Component;

import com.ll.eitcharge.domain.charger.charger.form.ChargerApiItemForm;
import com.ll.eitcharge.domain.charger.charger.form.ChargerUpdateForm;
import com.ll.eitcharge.domain.chargingStation.chargingStation.repository.ChargingStationRepository;

import lombok.RequiredArgsConstructor;

@Component
@StepScope
@RequiredArgsConstructor
public class ChargerBatchProcessor implements ItemProcessor<List<ChargerApiItemForm>, List<ChargerUpdateForm>> {
	private final ChargingStationRepository chargingStationRepository;

	@Override
	public List<ChargerUpdateForm> process(List<ChargerApiItemForm> items) {
		return items.stream()
			.filter(this::isValidItem)
			.map(ChargerUpdateForm::new)
			.toList();
	}

	private boolean isValidItem(ChargerApiItemForm item) {
		// 비즈니스 로직 상 유효하지 않은 값일 시 필터
		return (item.getStatId() != null && !item.getStatId().isEmpty()
			&& chargingStationRepository.existsById(item.getStatId())
			&& item.getChgerId() != null && !item.getChgerId().isEmpty()
			&& item.getChgerType() != null && !item.getChgerType().isEmpty()
			&& item.getOutput() != null && !item.getOutput().isEmpty()
			&& item.getMethod() != null && !item.getMethod().isEmpty());
	}
}
