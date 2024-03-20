package com.ll.eitcharge.domain.charger.update.charger.batch.writer;

import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicInteger;

import org.springframework.batch.core.configuration.annotation.StepScope;
import org.springframework.batch.item.Chunk;
import org.springframework.batch.item.ItemWriter;
import org.springframework.stereotype.Component;

import com.ll.eitcharge.domain.charger.charger.entity.Charger;
import com.ll.eitcharge.domain.charger.charger.form.ChargerUpdateForm;
import com.ll.eitcharge.domain.charger.charger.repository.ChargerRepository;
import com.ll.eitcharge.domain.chargingStation.chargingStation.entity.ChargingStation;
import com.ll.eitcharge.domain.chargingStation.chargingStation.repository.ChargingStationRepository;
import com.ll.eitcharge.domain.operatingCompany.operatingCompany.entity.OperatingCompany;
import com.ll.eitcharge.domain.operatingCompany.operatingCompany.repository.OperatingCompanyRepository;
import com.ll.eitcharge.domain.region.regionDetail.entity.RegionDetail;
import com.ll.eitcharge.domain.region.regionDetail.repository.RegionDetailRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@StepScope
@RequiredArgsConstructor
@Slf4j
public class ChargerBatchWriter implements ItemWriter<List<ChargerApiItemForm>> {
	private final RegionDetailRepository regionDetailRepository;
	private final OperatingCompanyRepository operatingCompanyRepository;
	private final ChargingStationRepository chargingStationRepository;
	private final ChargerRepository chargerRepository;

	@Override
	public void write(Chunk<? extends List<ChargerApiItemForm>> chunk) throws Exception {
		AtomicInteger execCount = new AtomicInteger();

		for (List<ChargerApiItemForm> items : chunk) {
			items.forEach(
				item -> {
					// 1. 지역 (if not exist return)
					RegionDetail regionDetail;
					String zsCode = item.getZscode();
					zsCode = zsCode.length() >= 5 ? zsCode.substring(0, 4) + "0" : zsCode;
					Optional<RegionDetail> opRegionDetail = regionDetailRepository.findById(zsCode);

					// if not exist return
					if (opRegionDetail.isEmpty()) return;
					// if exist
					regionDetail = opRegionDetail.get();

					// 2. 기관 (if not exist insert)
					OperatingCompany company;
					Optional<OperatingCompany> opCompany = operatingCompanyRepository.findById(item.getBusiId());

					// if exist
					if (opCompany.isPresent())
						company = opCompany.get();

					// if not exist insert
					else {
						company = OperatingCompany.builder()
							.busiId(item.getBusiId())
							.bnm(item.getBnm())
							.isPrimary("N")
							.build();

						log.info("[Batch] : 신규 기관 감지, 기관코드 : {}, 기관명 : {}", item.getBusiId(), item.getBnm());
						// 저장 후 해당 company를 select
						operatingCompanyRepository.saveAndFlush(company);
					}

					// 3. 충전소 (upsert)
					ChargingStation station;
					Optional<ChargingStation> opStation = chargingStationRepository.findById(item.getStatId());

					// if exist update
					if (opStation.isPresent()) {
						station = opStation.get();
						station.updateByApi(item, company, regionDetail);
					}
					// not exist insert
					else {
						station = ChargingStation.builder()
							.statId(item.getStatId())
							.statNm(item.getStatNm())
							.addr(item.getAddr())
							.location(item.getLocation())
							.useTime(item.getUseTime())
							.lat(item.getLat())
							.lng(item.getLng())
							.parkingFree(item.getParkingFree())
							.note(item.getNote())
							.limitYn(item.getLimitYn())
							.limitDetail(item.getLimitDetail())
							.delYn(item.getDelYn())
							.delDetail(item.getDelDetail())
							.trafficYn(item.getTrafficYn())
							.kind(item.getKind())
							.kindDetail(item.getKindDetail())
							.operatingCompany(company)
							.regionDetail(regionDetail)
							.build();
					}
					// 저장 후 해당 station을 select
					chargingStationRepository.saveAndFlush(station);

					// 4. 충전기 (upsert)
					Charger charger;
					Optional<Charger> opCharger = chargerRepository.findByStatIdAndChgerId(
						item.getChgerId(), item.getChgerId()
					);
					// if exist update
					if (opCharger.isPresent()) {
						charger = opCharger.get();
                        charger.updateByApi(item, station);
					}
					// not exist insert
					else {
						charger = Charger.builder()
                                .chgerId(item.getChgerId())
								.chgerType(item.getChgerType())
                                .stat(item.getStat())
                                .statUpdDt(item.getStatUpdDt())
                                .lastTsdt(item.getLastTsdt())
                                .lastTedt(item.getLastTedt())
                                .nowTsdt(item.getNowTsdt())
								.method(item.getMethod())
								.output(item.getOutput())
                                .chargingStation(station)
                                .build();
					}
					chargerRepository.save(charger);
					execCount.getAndIncrement();
				}
			);
			log.info("[Batch] : {}개 중 {}개 충전소 / 충전기 정보 업데이트 완료", items.size(), execCount.get());
		}
	}
}
