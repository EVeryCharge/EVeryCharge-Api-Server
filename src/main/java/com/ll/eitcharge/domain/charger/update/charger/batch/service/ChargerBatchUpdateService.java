package com.ll.eitcharge.domain.charger.update.charger.batch.service;

import java.time.LocalDateTime;

import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.JobParametersBuilder;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class ChargerBatchUpdateService {
	private final JobLauncher jobLauncher;
	private final Job dataBatchUpdateJob;

	public void runChargerBatchUpdateJob() {
		try {
			String execDate = LocalDateTime.now().toString();
			JobParameters parameters = new JobParametersBuilder()
				.addString("execDate", execDate)
				.toJobParameters();

			jobLauncher.run(dataBatchUpdateJob, parameters);
		} catch (Exception e) {
			log.error("[ERROR] : 배치 업데이트 중 오류 발생, {}", e.getMessage());
		}
	}
}

