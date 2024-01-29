package com.ll.eitcharge.domain.chargingStation.chargingStation.service;

import com.ll.eitcharge.domain.chargingStation.chargingStation.dto.ChargingStationItemDto;
import com.ll.eitcharge.domain.chargingStation.chargingStation.dto.ChargingStationItemsDto;
import com.ll.eitcharge.domain.chargingStation.chargingStation.dto.ChargingStationResponseDto;
import com.ll.eitcharge.domain.chargingStation.chargingStation.entity.ChargingStation;
import com.ll.eitcharge.domain.chargingStation.chargingStation.repository.ChargingStationRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.util.DefaultUriBuilderFactory;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ChargingStationApiService {

    private final ChargingStationRepository chargingStationRepository;
    private final RestTemplate restTemplate;

    public ChargingStationItemDto[] findfromApi(String stateId){

        DefaultUriBuilderFactory factory = new DefaultUriBuilderFactory();
        factory.setEncodingMode(DefaultUriBuilderFactory.EncodingMode.NONE);

        String url = makeApiUrl("ME174018");

        WebClient webClient = WebClient.builder()
                .baseUrl(url)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .build();

        ChargingStationResponseDto responseDto = webClient.get()
                .retrieve()
                .bodyToMono(ChargingStationResponseDto.class)
                .block();

        ChargingStationItemDto[] item = responseDto.getItems().getItem();

        return item;

    }

    public String makeApiUrl(String stateId){
        String baseUrl = "https://apis.data.go.kr/B552584/EvCharger/getChargerInfo";
        String serviceKey = "%2B61CsEc7Nmo65NvzqtjoQh0FPR0CAdc45WlyZDPkxYDqeSxUJ4E1ncpqn2H2qyN%2BHFXNqJD6JbNbghaWu9Tctw%3D%3D";
        String numOfRows = "100";
        String pageNo = "1";
        String statId = stateId;
        String dataType = "JSON";

        String url = baseUrl + "?serviceKey=" + serviceKey + "&numOfRows=" + numOfRows + "&pageNo=" + pageNo + "&statId=" + statId + "&dataType=" + dataType;

        return url;
    }






}
