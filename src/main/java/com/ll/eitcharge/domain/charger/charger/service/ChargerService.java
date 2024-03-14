package com.ll.eitcharge.domain.charger.charger.service;

import static com.ll.eitcharge.global.app.AppConfig.*;

import java.net.URI;
import java.util.HashMap;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.util.UriComponentsBuilder;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.ll.eitcharge.domain.charger.charger.entity.Charger;
import com.ll.eitcharge.domain.charger.charger.repository.ChargerRepository;
import com.ll.eitcharge.domain.chargingStation.chargingStation.repository.ChargingStationRepository;

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
    private final ChargingStationRepository chargingStationRepository;

    // 조회용 엔티티
    public Charger findByChargingStationStatIdAndChgerId(String statId, String chgerId) {
        return chargerRepository.findByChargingStationStatIdAndChgerId(statId, chgerId).get();
    }

    public HashMap webClientApiGetChargerStatus(String baseUrl, String serviceKey, int numOfRows, int pageNo, String type, int priod){
        URI uri = UriComponentsBuilder.fromUriString(baseUrl)
                .queryParam("serviceKey", serviceKey)
                .queryParam("numOfRows", numOfRows)
                .queryParam("pageNo", pageNo)
                .queryParam("dataType", type)
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
            throw new RuntimeException("ERROR : OpenAPI 데이터 JSON 파싱 오류", e);
        } catch(Exception e) {
            log.error("ERROR : OpenAPI GET 중 에러 발생(시간초과) {}", e.getMessage());
        }
        return hashMap;
    }
}