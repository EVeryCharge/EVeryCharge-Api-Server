package com.ll.eitcharge.domain.charger.charger.service;

import static com.ll.eitcharge.global.app.AppConfig.*;

import java.net.URI;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.util.UriComponentsBuilder;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.ll.eitcharge.domain.charger.charger.entity.Charger;
import com.ll.eitcharge.domain.charger.charger.form.ChargerApiItemForm;
import com.ll.eitcharge.domain.charger.charger.repository.ChargerRepository;
import com.ll.eitcharge.domain.chargingStation.chargingStation.entity.ChargingStation;
import com.ll.eitcharge.global.exceptions.GlobalException;

import io.netty.channel.ChannelOption;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.netty.http.client.HttpClient;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class ChargerService {
    private final ChargerRepository chargerRepository;

    // 조회용 엔티티
    public Charger findByChargingStationStatIdAndChgerId(ChargingStation chargingStation, String chgerId) {
        return chargerRepository.findByChargingStationAndChgerId(chargingStation, chgerId)
            .orElseThrow(
                GlobalException.E404::new
        );
    }

    // 조회용 엔티티
    public Page<Charger> findByPage(int pageNumber, int pageSize) {
        Pageable pageable = PageRequest.of(pageNumber, pageSize);
        return chargerRepository.findAll(pageable);
    }

    /**
     * 충전기 상태 변경감지 조회용 메소드
     */
    public HashMap webClientApiGetChargerStatus(
        String baseUrl, String serviceKey, int numOfRows, int pageNo, String type, int period
    ){
        URI uri = UriComponentsBuilder.fromUriString(baseUrl)
                .queryParam("serviceKey", serviceKey)
                .queryParam("numOfRows", numOfRows)
                .queryParam("pageNo", pageNo)
                .queryParam("dataType", type)
                .queryParam("period", period)
                .build(true)
                .toUri();

        HttpClient httpClient = HttpClient.create()
                .option(ChannelOption.CONNECT_TIMEOUT_MILLIS, 10000);

        WebClient webClient = WebClient.builder()
                .codecs(configurer -> configurer.defaultCodecs().maxInMemorySize(5 * 1024 * 1024))  //5MB
                .baseUrl(uri.toString())
                .clientConnector(new ReactorClientHttpConnector(httpClient))
                .build();

        HashMap hashMap = null;
        try {
            String response = webClient.get()
                .uri(uri)
                .header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
                .retrieve()
                .bodyToMono(String.class)
                .block();

            hashMap = objectMapper.readValue(response, HashMap.class);
        } catch (JsonProcessingException e) {
            log.error("[ERROR] : OpenAPI 데이터 JSON 파싱 오류 {}", e.getMessage());
        } catch(Exception e) {
            log.error("[ERROR] : OpenAPI 데이터 불러오기 중 에러 발생(시간초과) {}", e.getMessage());
        }
        return hashMap;
    }

    /**
     * 충전기 정보 조회용 메소드
     */
    public List<ChargerApiItemForm> webClientApiGetChargerInfo(
        String baseUrl, String serviceKey, int numOfRows, int pageNo, String dataType
    ){
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");

        URI uri = UriComponentsBuilder.fromUriString(baseUrl)
            .queryParam("serviceKey", serviceKey)
            .queryParam("numOfRows", numOfRows)
            .queryParam("pageNo", pageNo)
            .queryParam("dataType", dataType)
            .build(true)
            .toUri();

        HttpClient httpClient = HttpClient.create()
            .option(ChannelOption.CONNECT_TIMEOUT_MILLIS, 10000);

        WebClient webClient = WebClient.builder()
            .codecs(configurer -> configurer.defaultCodecs().maxInMemorySize(5 * 1024 * 1024))  //5MB
            .baseUrl(uri.toString())
            .clientConnector(new ReactorClientHttpConnector(httpClient))
            .build();

        HashMap apiDataMap = null;
        try {
            String response = webClient.get()
                .uri(uri)
                .header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
                .retrieve()
                .bodyToMono(String.class)
                .block();

            apiDataMap = objectMapper.readValue(response, HashMap.class);
        } catch (JsonProcessingException e) {
            log.error("[ERROR] : OpenAPI 데이터 JSON 파싱 오류 {}", e.getMessage());
        } catch(Exception e) {
            log.error("[ERROR] : OpenAPI 데이터 불러오기 중 에러 발생(시간초과) {}", e.getMessage());
        }

        List<Map<String, Object>> items = (List<Map<String, Object>>)((Map<String, Object>)apiDataMap.get("items")).get("item");

        List<ChargerApiItemForm> list = items.stream()
            .map(item -> new ChargerApiItemForm(item, formatter)).toList();
        if (!list.isEmpty()) {
            log.info("[OpenAPI] : OpenAPI 데이터 {}건 불러오기 완료", list.size());
        }
        return list;
    }
}