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
import com.ll.eitcharge.domain.charger.update.charger.batch.reader.ChargerBatchReader;
import com.ll.eitcharge.domain.charger.update.charger.batch.writer.ChargerBatchWriter;

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
	public Job chargerBatchUpdateJob(JobRepository jobRepository, Step chargerBatchUpdateStep) {
		return new JobBuilder("chargerBatchUpdateJob", jobRepository)
			.start(chargerBatchUpdateStep)
			.build();
	}

	@JobScope
	@Bean
	public Step chargerBatchUpdateStep(
		JobRepository jobRepository,
		ChargerBatchReader reader,
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
