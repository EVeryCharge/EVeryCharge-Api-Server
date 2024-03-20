package com.ll.eitcharge.domain.charger.update.charger.batch.config;

import java.util.List;

import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.configuration.annotation.JobScope;
import org.springframework.batch.core.job.builder.JobBuilder;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.step.builder.StepBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.PlatformTransactionManager;

import com.ll.eitcharge.domain.charger.charger.form.ChargerApiItemForm;
import com.ll.eitcharge.domain.charger.update.charger.batch.processor.ChargerBatchProcessor;
import com.ll.eitcharge.domain.charger.update.charger.batch.processor.ChargingStationBatchProcessor;
import com.ll.eitcharge.domain.charger.update.charger.batch.processor.CompanyBatchProcessor;
import com.ll.eitcharge.domain.charger.update.charger.batch.reader.ChargerApiBatchReader;
import com.ll.eitcharge.domain.charger.update.charger.batch.writer.ChargerBatchWriter;
import com.ll.eitcharge.domain.charger.update.charger.batch.writer.ChargingStationBatchWriter;
import com.ll.eitcharge.domain.charger.update.charger.batch.writer.CompanyBatchWriter;
import com.ll.eitcharge.domain.chargingStation.chargingStation.form.ChargingStationUpdateForm;
import com.ll.eitcharge.domain.operatingCompany.operatingCompany.form.OperatingCompanyUpdateForm;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class ChargerBatchUpdateConfig {
	@Getter
	@Setter
	private boolean isBatchUpdateRunning = true;
	private final int CHUNK_SIZE = 1;

	@Bean
	public Job chargerBatchUpdateJob(
		JobRepository jobRepository,
		Step companyBatchUpdateStep,
		Step stationBatchUpdateStep,
		Step chargerBatchUpdateStep
	) {
		return new JobBuilder("chargerBatchUpdateJob", jobRepository)
			.start(companyBatchUpdateStep)
			.next(stationBatchUpdateStep)
			.next(chargerBatchUpdateStep)
			.build();
	}

	@JobScope
	@Bean
	public Step companyBatchUpdateStep(
		JobRepository jobRepository,
		ChargerApiBatchReader reader,
		CompanyBatchProcessor processor,
		CompanyBatchWriter writer,
		PlatformTransactionManager manager
	) {
		return new StepBuilder("companyBatchUpdateStep", jobRepository)
			.<List<ChargerApiItemForm>, List<OperatingCompanyUpdateForm>>chunk(CHUNK_SIZE, manager)
			.reader(reader)
			.processor(processor)
			.writer(writer)
			.build();
	}

	@JobScope
	@Bean
	public Step stationBatchUpdateStep(
		JobRepository jobRepository,
		ChargerApiBatchReader reader,
		ChargingStationBatchProcessor processor,
		ChargingStationBatchWriter writer,
		PlatformTransactionManager manager
	) {
		return new StepBuilder("stationBatchUpdateStep", jobRepository)
			.<List<ChargerApiItemForm>, List<ChargingStationUpdateForm>>chunk(CHUNK_SIZE, manager)
			.reader(reader)
			.processor(processor)
			.writer(writer)
			.build();
	}

	@JobScope
	@Bean
	public Step chargerBatchUpdateStep(
		JobRepository jobRepository,
		ChargerApiBatchReader reader,
		ChargerBatchProcessor processor,
		ChargerBatchWriter writer,
		PlatformTransactionManager manager
	) {
		return new StepBuilder("chargerBatchUpdateStep", jobRepository)
			.<List<ChargerApiItemForm>, List<ChargerApiItemForm>>chunk(CHUNK_SIZE, manager)
			.reader(reader)
			.processor(processor)
			.writer(writer)
			.build();
	}
}
