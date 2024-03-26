package com.ll.everycharge.domain.charger.update.charger.batch.processor;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.batch.core.configuration.annotation.StepScope;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.stereotype.Component;

import com.ll.everycharge.domain.charger.charger.form.ChargerApiItemForm;
import com.ll.everycharge.domain.operatingCompany.operatingCompany.entity.OperatingCompany;
import com.ll.everycharge.domain.operatingCompany.operatingCompany.repository.OperatingCompanyRepository;
import com.ll.everycharge.domain.region.regionDetail.entity.RegionDetail;
import com.ll.everycharge.domain.region.regionDetail.repository.RegionDetailRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@StepScope
@Slf4j
@RequiredArgsConstructor
public class ChargerApiBatchProcessor implements ItemProcessor<List<ChargerApiItemForm>, List<ChargerApiItemForm>> {
	private final RegionDetailRepository regionDetailRepository;
	private final OperatingCompanyRepository companyRepository;

	@Override
	public List<ChargerApiItemForm> process(List<ChargerApiItemForm> item) {
		List<RegionDetail> regionList = regionDetailRepository.findAll();
		List<OperatingCompany> companyList = companyRepository.findAll();
		HashMap<String, String> newCompanyMap = new HashMap<>();

		// 조건에 맞춰 필터
		List<ChargerApiItemForm> filterdList = item.stream()
			.filter(i -> isValidItem(i, regionList, companyList, newCompanyMap))
			.toList();

		// 감지된 새로운 기관을 엔티티로 변환 후 저장
		List<OperatingCompany> newCompanyList = newCompanyMap.entrySet().stream()
			.map(
				entry -> OperatingCompany.builder()
					.busiId(entry.getKey())
					.bnm(entry.getValue())
					.isPrimary("N")
					.build()
			)
			.toList();
		if (!newCompanyList.isEmpty()) {
			log.info("[Batch] : 신규 기관 {}개 감지 및 저장 완료", newCompanyList.size());
			companyRepository.saveAll(newCompanyList);
		}

		return filterdList;
	}

	private boolean isValidItem(
		ChargerApiItemForm item,
		List<RegionDetail> regionList,
		List<OperatingCompany> companyList,
		Map<String, String> newCompanyMap
	) {
		if (item.getStatId() != null && !item.getStatId().isEmpty()
			&& item.getStatNm() != null && !item.getStatNm().isEmpty()
			&& item.getLat() != null && item.getLng() != null
			&& item.getAddr() != null && !item.getAddr().isEmpty()
			&& item.getChgerId() != null && !item.getChgerId().isEmpty()
			&& item.getChgerType() != null && !item.getChgerType().isEmpty()
			&& item.getBusiId() != null && item.getBnm() != null
			&& item.getZscode() != null && regionList.stream().anyMatch(
			region -> region.getZscode().contentEquals(item.getZscode()))
		) {
			if (companyList.stream().noneMatch(company -> company.getBusiId().contentEquals(item.getBusiId()))) {
				newCompanyMap.put(item.getBusiId(), item.getBnm());
			}
			return true;
		}
		return false;
	}
}
