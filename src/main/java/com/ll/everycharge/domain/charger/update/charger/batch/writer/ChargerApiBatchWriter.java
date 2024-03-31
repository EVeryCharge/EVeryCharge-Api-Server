package com.ll.everycharge.domain.charger.update.charger.batch.writer;

import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.locationtech.jts.geom.GeometryFactory;
import org.springframework.batch.core.configuration.annotation.StepScope;
import org.springframework.batch.item.Chunk;
import org.springframework.batch.item.ItemWriter;
import org.springframework.stereotype.Component;

import com.ll.everycharge.domain.charger.charger.entity.Charger;
import com.ll.everycharge.domain.charger.charger.form.ChargerApiItemForm;
import com.ll.everycharge.domain.charger.charger.repository.ChargerRepository;
import com.ll.everycharge.domain.chargingStation.chargingStation.entity.ChargingStation;
import com.ll.everycharge.domain.chargingStation.chargingStation.repository.ChargingStationRepository;
import com.ll.everycharge.domain.operatingCompany.operatingCompany.entity.OperatingCompany;
import com.ll.everycharge.domain.operatingCompany.operatingCompany.repository.OperatingCompanyRepository;
import com.ll.everycharge.domain.region.regionDetail.entity.RegionDetail;
import com.ll.everycharge.domain.region.regionDetail.repository.RegionDetailRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@StepScope
@RequiredArgsConstructor
@Slf4j
public class ChargerApiBatchWriter implements ItemWriter<List<ChargerApiItemForm>> {
	private final RegionDetailRepository regionRepository;
	private final OperatingCompanyRepository companyRepository;
	private final ChargingStationRepository stationRepository;
	private final ChargerRepository chargerRepository;
	private final GeometryFactory GEOMETRY_FACTORY = new GeometryFactory();

	@Override
	public void write(Chunk<? extends List<ChargerApiItemForm>> chunk) {
		int insertStationCnt = 0, updateStationCnt = 0, insertChargerCnt = 0, updateChargerCnt = 0;

		Map<String, RegionDetail> regionMap = regionRepository.findAll().stream()
			.collect(Collectors.toMap(RegionDetail::getZscode, region -> region));
		Map<String, OperatingCompany> companyMap = companyRepository.findAll().stream()
			.collect(Collectors.toMap(OperatingCompany::getBusiId, company -> company));

		List<ChargingStation> updatingStationList = new LinkedList<>();
		List<Charger> updatingChargerList = new LinkedList<>();

		try {
			for (List<ChargerApiItemForm> items : chunk) {
				if (items.isEmpty()) continue;

				for (ChargerApiItemForm item : items) {
					RegionDetail region = regionMap.get(item.getZscode());
					OperatingCompany company = companyMap.get(item.getBusiId());
					if (region == null || company == null) continue;

					// 충전소 upsert
					ChargingStation station = stationRepository.findById(item.getStatId()).orElse(null);
					if (station != null) {
						station.update(item, company, region);
						station.setPoint(GEOMETRY_FACTORY, station);

						updatingStationList.add(station);
						updateStationCnt++;
					} else {
						station = new ChargingStation(item, company, region);
						station.setPoint(GEOMETRY_FACTORY, station);

						stationRepository.saveAndFlush(station);
						insertStationCnt++;
					}

					// 충전기 upsert
					Charger charger = chargerRepository.findByChargingStationAndChgerId(station, item.getChgerId())
						.orElse(null);
					if (charger != null) {
						charger.update(item, station);
						updateChargerCnt++;
					} else {
						charger = new Charger(item, station);
						insertChargerCnt++;
					}
					updatingChargerList.add(charger);
				}
			}

			if (!updatingStationList.isEmpty()) {
				stationRepository.saveAll(updatingStationList);
				log.info("[Batch] : 충전소 데이터 신규 {}건, 업데이트 {}건 저장 완료", insertStationCnt, updateStationCnt);
			}
			if (!updatingStationList.isEmpty()) {
				chargerRepository.saveAll(updatingChargerList);
				log.info("[Batch] : 충전기 데이터 신규 {}건, 업데이트 {}건 저장 완료", insertChargerCnt, updateChargerCnt);
			}
		} catch (Exception e) {
			log.error("[ERROR] : Batch 처리 중 오류 발생, {}", e.getMessage());
			e.printStackTrace();
		}
	}
}
