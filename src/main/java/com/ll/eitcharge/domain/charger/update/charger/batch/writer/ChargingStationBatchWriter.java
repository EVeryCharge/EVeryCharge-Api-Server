package com.ll.eitcharge.domain.charger.update.charger.batch.writer;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.batch.core.configuration.annotation.StepScope;
import org.springframework.batch.item.Chunk;
import org.springframework.batch.item.ItemWriter;
import org.springframework.stereotype.Component;

import com.ll.eitcharge.domain.chargingStation.chargingStation.entity.ChargingStation;
import com.ll.eitcharge.domain.chargingStation.chargingStation.form.ChargingStationUpdateForm;
import com.ll.eitcharge.domain.chargingStation.chargingStation.repository.ChargingStationRepository;
import com.ll.eitcharge.domain.operatingCompany.operatingCompany.entity.OperatingCompany;
import com.ll.eitcharge.domain.operatingCompany.operatingCompany.repository.OperatingCompanyRepository;
import com.ll.eitcharge.domain.region.regionDetail.entity.RegionDetail;
import com.ll.eitcharge.domain.region.regionDetail.repository.RegionDetailRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@StepScope
@Component
@Slf4j
@RequiredArgsConstructor
public class ChargingStationBatchWriter implements ItemWriter<List<ChargingStationUpdateForm>> {
	private final OperatingCompanyRepository companyRepository;
	private final RegionDetailRepository regionDetailRepository;
	private final ChargingStationRepository chargingStationRepository;

	@Override
	public void write(Chunk<? extends List<ChargingStationUpdateForm>> chunk) {
		int insertCount = 0;
		int updateCount = 0;
		int execCount = 0;

		for (List<ChargingStationUpdateForm> items : chunk) {
			List<ChargingStation> execList = new ArrayList<>();

			for (ChargingStationUpdateForm item : items) {
				ChargingStation station;
				OperatingCompany company = companyRepository.findById(item.getBusiId()).get();
				RegionDetail regionDetail = regionDetailRepository.findById(item.getZscode()).get();

				Optional<ChargingStation> opStation = chargingStationRepository.findById(item.getStatId());
				if (opStation.isEmpty()) {
					station = new ChargingStation(item, company, regionDetail);
					insertCount++;
				} else {
					station = opStation.get();
					station.update(item, company, regionDetail);
					updateCount++;
				}
				execList.add(station);
			}
			chargingStationRepository.saveAll(execList);
			execCount += execList.size();
		}
		log.info("[Batch] : 충전소 데이터 {}건 중 신규 충전소 {}건 추가, 기존 충전소 {}건 업데이트 완료"
			, execCount, insertCount, updateCount);
	}
}
