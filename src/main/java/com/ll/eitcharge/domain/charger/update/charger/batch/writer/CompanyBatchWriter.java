package com.ll.eitcharge.domain.charger.update.charger.batch.writer;

import java.util.List;

import org.springframework.batch.core.configuration.annotation.StepScope;
import org.springframework.batch.item.Chunk;
import org.springframework.batch.item.ItemWriter;
import org.springframework.stereotype.Component;

import com.ll.eitcharge.domain.operatingCompany.operatingCompany.entity.OperatingCompany;
import com.ll.eitcharge.domain.operatingCompany.operatingCompany.form.OperatingCompanyUpdateForm;
import com.ll.eitcharge.domain.operatingCompany.operatingCompany.repository.OperatingCompanyRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@StepScope
@Component
@Slf4j
@RequiredArgsConstructor
public class CompanyBatchWriter implements ItemWriter<List<OperatingCompanyUpdateForm>> {
	private final OperatingCompanyRepository operatingCompanyRepository;

	@Override
	public void write(Chunk<? extends List<OperatingCompanyUpdateForm>> chunk) {
		int newCompanyCount = 0;
		for (List<OperatingCompanyUpdateForm> items : chunk) {
			operatingCompanyRepository
				.saveAll(
					items.stream()
						.map(OperatingCompany::new)
						.toList()
				);
			newCompanyCount += items.size();
		}
		if (newCompanyCount != 0) {
			log.info("[Batch] : 신규 기관 {}건 감지, DB 저장 완료", newCompanyCount);
		}
	}
}
