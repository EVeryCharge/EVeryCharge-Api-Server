package com.ll.eitcharge.standard.util;

import java.io.ByteArrayInputStream;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.InputStream;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import com.aspose.cells.Workbook;

import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;

@Component
@Slf4j
public class ExcelDataUtil {
	private final WebClient webClient;

	public ExcelDataUtil() {
		this.webClient = WebClient.builder()
			.defaultHeader(HttpHeaders.ACCEPT, MediaType.APPLICATION_OCTET_STREAM_VALUE)
			.defaultHeader(HttpHeaders.ACCEPT_ENCODING, "gzip, deflate, br, zstd")
			.defaultHeader(HttpHeaders.ACCEPT_LANGUAGE, "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7")
			.build();
	}

	public Workbook getDataByWorkbook(String httpRequestUrl) {
		// HTTP 요청, 파일 다운로드
		Mono<byte[]> responseMono = webClient.get()
			.uri(httpRequestUrl)
			.accept(MediaType.APPLICATION_OCTET_STREAM)
			.retrieve()
			.bodyToMono(byte[].class);

		InputStream inputStream = new ByteArrayInputStream(responseMono.blockOptional().orElse(new byte[0]));
		try {
			return new Workbook(inputStream);
		} catch (Exception e) {
			log.error("ERROR : API로부터 Workbook 불러오기 실패");
			e.printStackTrace();
			return null;
		}
	}

	public Workbook readDataByWorkbook(String filePath) {
		try (InputStream inputStream = new FileInputStream(filePath)) {
			return new Workbook(inputStream);
	} catch (FileNotFoundException e) {
			log.error("ERROR : 파일을 찾을 수 없습니다.");
			e.printStackTrace();
		} catch (Exception e) {
			log.error("ERROR : 파일을 변환할 수 없습니다.");
		}
		return null;
	}
}
