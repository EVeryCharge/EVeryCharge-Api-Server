// package com.ll.eitcharge.domain.charger.update.charger.batch.processor;
//
// import java.util.HashSet;
// import java.util.List;
// import java.util.Set;
//
// import org.springframework.batch.core.configuration.annotation.StepScope;
// import org.springframework.batch.item.ItemProcessor;
// import org.springframework.stereotype.Component;
//
// import com.ll.eitcharge.domain.charger.charger.form.ChargerApiItemForm;
// import com.ll.eitcharge.domain.operatingCompany.operatingCompany.form.OperatingCompanyUpdateForm;
// import com.ll.eitcharge.domain.operatingCompany.operatingCompany.repository.OperatingCompanyRepository;
//
// import lombok.RequiredArgsConstructor;
//
// /**
//  * item을 받아 insert를 실행할 새로 발견된 busiId와 bnm을 리턴한다.
//  */
// @Component
// @StepScope
// @RequiredArgsConstructor
// public class CompanyBatchProcessor
// 	implements ItemProcessor<List<ChargerApiItemForm>, List<OperatingCompanyUpdateForm>> {
// 	private final OperatingCompanyRepository companyRepository;
//
// 	@Override
// 	public List<OperatingCompanyUpdateForm> process(List<ChargerApiItemForm> items) {
// 		Set<String> distinctBusiIds = new HashSet<>();
//
// 		return items.stream()
// 			.filter(item -> isNewItem(item, distinctBusiIds))
// 			.map(OperatingCompanyUpdateForm::new)
// 			.toList();
// 	}
//
// 	private boolean isNewItem(ChargerApiItemForm item, Set<String> distinctBusiIds) {
// 		if (item.getBusiId() != null && !item.getBusiId().isEmpty()
// 			&& item.getBnm() != null && item.getBnm().isEmpty()
// 			&& !distinctBusiIds.contains(item.getBusiId())
// 			&& !companyRepository.existsById(item.getBusiId())) {
//
// 			distinctBusiIds.add(item.getBusiId());
// 			return true;
// 		}
// 		return false;
// 	}
// }
