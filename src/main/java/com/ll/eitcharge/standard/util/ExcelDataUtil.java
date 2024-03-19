package com.ll.eitcharge.standard.util;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.security.SecureRandom;
import java.security.cert.X509Certificate;

import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;

import org.springframework.stereotype.Component;

import com.aspose.cells.Workbook;
import com.ll.eitcharge.global.app.AppConfig;

import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class ExcelDataUtil {
	/**
	 * HTTP 요청을 통해 xls, xlsx 파일을 Workbook 객체로 리턴한다.
	 * 작성자 : 이상제
	 */
	public Workbook getDataFromHttpByWorkbook(String httpRequestUrl) {
		try {
			TrustManager[] trustAllCerts = new TrustManager[]{
				new X509TrustManager() {
					public X509Certificate[] getAcceptedIssuers() {
						return null;
					}

					public void checkClientTrusted(X509Certificate[] certs, String authType) {
					}

					public void checkServerTrusted(X509Certificate[] certs, String authType) {
					}
				}
			};

			// SSL 인증 무시 설정
			SSLContext sslContext = SSLContext.getInstance("SSL");
			sslContext.init(null, trustAllCerts, new SecureRandom());

			URL url = new URL(httpRequestUrl);
			HttpURLConnection httpUrlConnection = (HttpURLConnection) url.openConnection();

			if (httpUrlConnection instanceof HttpsURLConnection) {
				((HttpsURLConnection) httpUrlConnection).setSSLSocketFactory(sslContext.getSocketFactory());
			}

			// HTTP 요청 수행 및 데이터 응답 받기
			InputStream inputStream = httpUrlConnection.getInputStream();

			// InputStream으로부터 Workbook 객체 생성
			return new Workbook(inputStream);
		} catch (Exception e) {
			log.error("[ERROR] : API로부터 Workbook 불러오기 실패");
			e.getCause();
			return null;
		}
	}

	public Workbook readDataFromFileByWorkbook(String filePath) {
		try (InputStream inputStream = AppConfig.getResourceAsStream(filePath)) {
			return new Workbook(inputStream);
      
		} catch (FileNotFoundException e) {
			log.error("ERROR : 파일을 찾을 수 없습니다. {}", e.getMessage());
		} catch (Exception e) {
			log.error("ERROR : 파일을 변환할 수 없습니다. {}", e.getMessage());
		}
		return null;
	}
}
