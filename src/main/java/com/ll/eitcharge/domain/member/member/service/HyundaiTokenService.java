package com.ll.eitcharge.domain.member.member.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.commons.codec.binary.Base64;
import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.HashMap;
import java.util.Map;

@Service
public class HyundaiTokenService {

    private final ObjectMapper objectMapper;
    @Value("${custom.hyundai.clientId}")
    private String clientId;
    @Value("${custom.hyundai.clientSecret}")
    private String clientSecret;

    public HyundaiTokenService() {
        this.objectMapper = new ObjectMapper();
    }


    public String tokenAPICall(String requestBody) throws IOException {
        // 토큰 요청을 보낼 엔드포인트 URL
        String endpointUrl = "https://prd.kr-ccapi.hyundai.com/api/v1/user/oauth2/token";

        // HttpClient 생성
        CloseableHttpClient httpClient = HttpClients.createDefault();

        // HTTP POST 요청 생성
        HttpPost httpPost = new HttpPost(endpointUrl);


        // HTTP 요청에 헤더 설정
        httpPost.setHeader("Content-Type", "application/x-www-form-urlencoded");

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
        System.out.println("no");
        // 응답이 없는 경우 빈 문자열 반환
        return "";
    }

    public void userProfile(String accessToken) {
        StringBuffer sb;
        String responseData = "";
        try{
            String apiURL = "https://prd.kr-ccapi.hyundai.com/api/v1/user/profile";
            URL url = new URL(apiURL);

            HttpURLConnection con = (HttpURLConnection)url.openConnection();

            con.setRequestMethod("GET");

            // Set Header Info
            con.setRequestProperty("Authorization", "Bearer " + accessToken);

            int responseCode = con.getResponseCode();
            BufferedReader br;
            if(con.getResponseCode() == HttpURLConnection.HTTP_OK){
                br = new BufferedReader(new InputStreamReader(con.getInputStream())); // 정상호출
            } else {
                br = new BufferedReader(new InputStreamReader(con.getErrorStream())); // 에러발생
            }

            sb = new StringBuffer();
            while ((responseData = br.readLine()) != null){
                sb.append(responseData);
            }
            br.close();

            System.out.println("responseCode = " + responseCode);
            System.out.println("userData = "+sb.toString());

        } catch (Exception e) {
            System.out.println(e);
        }
    }

    public Map<String, String> getFirstCarInfo(String accessToken) {
        try {
            String apiURL = "https://dev.kr-ccapi.hyundai.com/api/v1/car/profile/carlist";
            URL url = new URL(apiURL);
            HttpURLConnection con = (HttpURLConnection) url.openConnection();
            con.setRequestMethod("GET");
            con.setRequestProperty("Authorization", "Bearer " + accessToken);

            int responseCode = con.getResponseCode();

            if (responseCode == HttpURLConnection.HTTP_OK) {
                BufferedReader reader = new BufferedReader(new InputStreamReader(con.getInputStream()));
                StringBuilder responseBuilder = new StringBuilder();
                String line;
                while ((line = reader.readLine()) != null) {
                    responseBuilder.append(line);
                }
                reader.close();
                String jsonResponse = responseBuilder.toString();

                // Extract first carId and carSellname from JSON response
                ObjectMapper objectMapper = new ObjectMapper();
                JsonNode rootNode = objectMapper.readTree(jsonResponse);
                JsonNode carsNode = rootNode.path("cars");
                if (carsNode.isArray() && carsNode.size() > 0) {
                    JsonNode firstCarNode = carsNode.get(0);
                    String firstCarId = firstCarNode.path("carId").asText();
                    String firstCarSellname = firstCarNode.path("carSellname").asText();

                    Map<String, String> carInfo = new HashMap<>();
                    carInfo.put("carId", firstCarId);
                    carInfo.put("carSellname", firstCarSellname);

                    return carInfo;
                }
            } else {
                System.out.println("Failed to fetch car list. Response code: " + responseCode);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        Map<String, String> carInfo = new HashMap<>();
        carInfo.put("carId", null);
        carInfo.put("carSellname", null);

        return carInfo;
    }
    public String getBattery(String carId, String accessToken) {
        StringBuffer responseBuffer = new StringBuffer();

        try {
            // API 요청을 보낼 URL
            String apiUrl = "https://dev.kr-ccapi.hyundai.com/api_sample/v1/car/status/"+ carId +"/ev/battery";
            URL url = new URL(apiUrl);
            HttpURLConnection con = (HttpURLConnection) url.openConnection();

            // 요청 헤더 설정
            con.setRequestMethod("GET");
//            con.setRequestProperty("Authorization", "Bearer " + "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJ1aWQiOiI1N2JkZTc5MS1kODNhLTQ4OTMtYTAzNC0zZDcxZGY4OTVkMTciLCJpc3MiOiJibHVlbGluayIsInBpZCI6IjYyYTk3NmZhYmI4YjVkZTg5YzYzYjhmYiIsImV4cCI6NDEwMjMyNjAwMCwibGF0IjoxNzExMjkyMjkwLCJzaWQiOiI0MjExZjE5OS1lNzk4LTQ1OWItYmM0MS0yNjBjYWIzNmExZWQifQ.AXhUW6k8eLiTDJQAzqalNNU3bfvijdPC7KhvmIvtTP8Iu_g06QLyhg1ZE-rsrpMJGuo10rXRcTRj6Daoh5ybCXNc2rdkmMnoGNFAnQQiO5BfjKnBNw7dP9aG_HXsyrL9KdS8FBqsY_MBfOcreC8poLp-NuSCUl3O0My0--Iipr4sKHDYFNOxAKe8BPQeiHI1YxzrnSrbUSnihwxFLaqaudasJiF5CV8ks65g6Cj4lB4KUQ6a5M3NASsWc5J5yy3KJj6Jxj1VWKZaqAa2mX8pGD6WZKvgRgw8LqoNdfCt_XCEfO5EB3cJxj-RyWK3nkkJjnPaNl4aiLvgw59regSZ0Q");
            con.setRequestProperty("Authorization", "Bearer " + accessToken);
            con.setRequestProperty("Content-Type", "application/json");

            int responseCode = con.getResponseCode();

            if (responseCode == HttpURLConnection.HTTP_OK) {
                // 응답을 읽어옴
                BufferedReader reader = new BufferedReader(new InputStreamReader(con.getInputStream()));
                String line;
                while ((line = reader.readLine()) != null) {
                    responseBuffer.append(line);
                }
                reader.close();

                // JSON 응답에서 "soc" 필드 값을 추출하여 반환
                String jsonResponse = responseBuffer.toString();
                JsonNode rootNode = objectMapper.readTree(jsonResponse);
                JsonNode socNode = rootNode.path("soc");
                return socNode.asText();
            } else {
                System.out.println("Failed to fetch battery status. Response code: " + responseCode);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
}
