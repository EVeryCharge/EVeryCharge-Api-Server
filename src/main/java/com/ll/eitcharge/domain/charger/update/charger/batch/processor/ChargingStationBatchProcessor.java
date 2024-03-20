package com.ll.eitcharge.domain.charger.update.charger.batch.processor;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.batch.core.configuration.annotation.StepScope;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.stereotype.Component;

import com.ll.eitcharge.domain.charger.charger.form.ChargerApiItemForm;
import com.ll.eitcharge.domain.chargingStation.chargingStation.form.ChargingStationUpdateForm;
import com.ll.eitcharge.domain.operatingCompany.operatingCompany.repository.OperatingCompanyRepository;
import com.ll.eitcharge.domain.region.regionDetail.repository.RegionDetailRepository;

import lombok.RequiredArgsConstructor;

@Component
@StepScope
@RequiredArgsConstructor
public class ChargingStationBatchProcessor
	implements ItemProcessor<List<ChargerApiItemForm>, List<ChargingStationUpdateForm>> {
	private final OperatingCompanyRepository companyRepository;
	private final RegionDetailRepository regionDetailRepository;

	@Override
	public List<ChargingStationUpdateForm> process(List<ChargerApiItemForm> items) throws Exception {
		Set<String> distinctStatIds = new HashSet<>();

		return items.stream()
			.filter(item -> isDistinctItem(item, distinctStatIds))
			.map(ChargingStationUpdateForm::new)
			.toList();
	}

	private boolean isDistinctItem(ChargerApiItemForm item, Set<String> distinctStatIds) {
		if (item.getStatId() != null && !item.getStatId().isEmpty()
			&& !distinctStatIds.contains(item.getStatId())
			&& item.getStatNm() != null && !item.getStatNm().isEmpty()
			&& item.getLat() != null && item.getLng() != null
			&& item.getZscode() != null && item.getZscode().length() >= 5
			&& regionDetailRepository.existsById(item.getZscode().substring(0, 4) + "0")
			&& item.getBusiId() != null && companyRepository.existsById(item.getBusiId())) {

			distinctStatIds.add(item.getStatId());
			return true;
		}
		return false;
	}
}
