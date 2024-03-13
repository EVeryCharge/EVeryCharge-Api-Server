package com.ll.eitcharge.domain.charger.charger.service;

import static com.ll.eitcharge.global.app.AppConfig.*;

import java.net.URI;
import java.util.HashMap;
import java.util.List;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.util.UriComponentsBuilder;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.ll.eitcharge.domain.charger.charger.repository.ChargerRepository;
import com.ll.eitcharge.domain.chargingStation.chargingStation.entity.ChargingStation;
import com.ll.eitcharge.domain.chargingStation.chargingStation.repository.ChargingStationRepository;

import io.netty.channel.ChannelOption;
import lombok.RequiredArgsConstructor;
import reactor.netty.http.client.HttpClient;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ChargerService {
    private final ChargerRepository chargerRepository;
    private final ChargingStationRepository chargingStationRepository;

    public List<ChargingStation> findAll() {
        return chargingStationRepository.findAll();
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

        String response = webClient.get()
                .uri(uri)
                .header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
                .retrieve()
                .bodyToMono(String.class)
                .block();

        HashMap hashMap = null;
        try {
            hashMap = objectMapper.readValue(response, HashMap.class);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("JSON 파싱 오류", e);
        }
        return hashMap;
    }
}