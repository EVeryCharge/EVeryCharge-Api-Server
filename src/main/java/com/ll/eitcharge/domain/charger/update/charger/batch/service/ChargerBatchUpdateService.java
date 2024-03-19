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
	private final Job chargerBatchUpdateJob;

	public void runChargerBatchUpdateJob() {
		try {
			String execDate = LocalDateTime.now().toString();
			JobParameters parameters = new JobParametersBuilder()
				.addString("execDate", execDate)
				.toJobParameters();

			jobLauncher.run(chargerBatchUpdateJob, parameters);
		} catch (Exception e) {
			log.info("[Batch] : 배치 업데이트 중 오류, {}", e.getMessage());
		}
	}
}
	//
	// int pageNo = 1;
	// List<ChargerApiItemForm> apiResponse;
	// 	do {
	// 		// 500개씩 끊어서 API 응답을 정제한 Form 리스트를 받는다.
	// 		apiResponse = chargerService.webClientApiGetChargerInfo(baseUrl, contentType, numOfRows, pageNo, contentType);
	// 		try {
	// 		// 이후 배치 작업이 500개씩 끊어서 반복적으로 실행된다.
	// 		jobLauncher.run(chargerBatchUpdateJob, jobParameters(), apiResponse);
	// 		pageNo++;
	// 		} catch (Exception e) {
	// 		log.info("[Batch] : 배치 업데이트 중 오류, {}", e.getMessage());
	// 		}
	// 		} while (!apiResponse.isEmpty());

