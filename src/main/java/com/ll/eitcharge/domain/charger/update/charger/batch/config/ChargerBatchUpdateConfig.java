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
import com.ll.eitcharge.domain.charger.update.charger.batch.processor.ChargerApiBatchProcessor;
import com.ll.eitcharge.domain.charger.update.charger.batch.reader.ChargerApiBatchReader;
import com.ll.eitcharge.domain.charger.update.charger.batch.writer.ChargerApiBatchWriter;

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
		Step chargerApiBatchUpdateStep,
		Step companyBatchUpdateStep,
		Step stationBatchUpdateStep,
		Step chargerBatchUpdateStep
	) {
		return new JobBuilder("chargerApiBatchUpdateJob", jobRepository)
			.start(chargerApiBatchUpdateStep)
			.build();
	}

	@JobScope
	@Bean
	public Step chargerApiBatchUpdateStep(
		JobRepository jobRepository,
        ChargerApiBatchReader reader,
        ChargerApiBatchProcessor processor,
        ChargerApiBatchWriter writer,
        PlatformTransactionManager manager
	) {
		return new StepBuilder("chargerApiBatchUpdateStep", jobRepository)
			.<List<ChargerApiItemForm>, List<ChargerApiItemForm>>chunk(CHUNK_SIZE, manager)
			.reader(reader)
			.processor(processor)
			.writer(writer)
			.build();
	}
}
