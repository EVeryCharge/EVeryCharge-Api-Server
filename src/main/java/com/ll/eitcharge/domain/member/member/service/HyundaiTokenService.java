package com.ll.eitcharge.domain.member.member.service;

import org.apache.commons.codec.binary.Base64;
import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class HyundaiTokenService {

    public String tokenAPICall(String requestBody) throws IOException {
        // 토큰 요청을 보낼 엔드포인트 URL
        String endpointUrl = "https://prd.kr-ccapi.hyundai.com/api/v1/user/oauth2/token";

        // HttpClient 생성
        CloseableHttpClient httpClient = HttpClients.createDefault();

        // HTTP POST 요청 생성
        HttpPost httpPost = new HttpPost(endpointUrl);


        // HTTP 요청에 헤더 설정
        httpPost.setHeader("Content-Type", "application/x-www-form-urlencoded");

        // 클라이언트 ID와 시크릿
        String clientId = "4211f199-e798-459b-bc41-260cab36a1ed";
        String clientSecret = "n7VbTNfONy3DZKhIsEYHACB5fVDlSGfSoopH7NuPDQuxyJzk";

        // HTTP Basic 인증 정보 설정
        String credentials = clientId + ":" + clientSecret;
        String encodedCredentials = Base64.encodeBase64String(credentials.getBytes());
        httpPost.setHeader("Authorization", "Basic " + encodedCredentials);

        // HTTP 요청에 요청 본문 설정
        httpPost.setEntity(new StringEntity(requestBody));

        // HTTP 요청 실행 및 응답 처리
        try (CloseableHttpResponse response = httpClient.execute(httpPost)) {
            // 응답 본문을 문자열로 변환
            HttpEntity entity = response.getEntity();
            if (entity != null) {
                String responseBody = EntityUtils.toString(entity);
                return responseBody;
            }
        }
        // 응답이 없는 경우 빈 문자열 반환
        return "";
    }
}
