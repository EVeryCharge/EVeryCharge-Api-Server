package com.ll.eitcharge.domain.chargingStation.chargingStation.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ll.eitcharge.domain.chargingStation.chargingStation.dto.ChargingStationItemDto;
import com.ll.eitcharge.domain.chargingStation.chargingStation.dto.ChargingStationResponseDto;
import com.ll.eitcharge.domain.chargingStation.chargingStation.dto.ItemListDto;
import com.ll.eitcharge.domain.chargingStation.chargingStation.repository.ChargingStationRepository;
import com.ll.eitcharge.global.rsData.RsData;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.util.DefaultUriBuilderFactory;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.net.URI;
import java.util.HashMap;
import java.util.List;


@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class ChargingStationApiService {

    private final ChargingStationRepository chargingStationRepository;
    private final ObjectMapper objectMapper;

    public void findFromApi(String stateId){

        DefaultUriBuilderFactory factory = new DefaultUriBuilderFactory();
        factory.setEncodingMode(DefaultUriBuilderFactory.EncodingMode.NONE);

        String url = makeApiUrl(stateId);

        WebClient webClient = WebClient.builder()
                .baseUrl(url)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .build();

        ChargingStationResponseDto responseDto = webClient.get()
                .retrieve()
                .bodyToMono(ChargingStationResponseDto.class)
                .block();



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

    public String findFromApi2(String stateId){

        //인코딩 모드 NONE
        DefaultUriBuilderFactory factory = new DefaultUriBuilderFactory();
        factory.setEncodingMode(DefaultUriBuilderFactory.EncodingMode.NONE);

        String baseUrl = "https://apis.data.go.kr";
        String serviceKey = "%2B61CsEc7Nmo65NvzqtjoQh0FPR0CAdc45WlyZDPkxYDqeSxUJ4E1ncpqn2H2qyN%2BHFXNqJD6JbNbghaWu9Tctw%3D%3D";
        String numOfRows = "100";
        String pageNo = "1";
        String statId = stateId;

        WebClient webClient = WebClient.builder()
                .uriBuilderFactory(factory)
                .baseUrl(baseUrl)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .build();

// serviceKey : {SERVICE_KEY_HERE}

        String response = webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/B552584/EvCharger/getChargerInfo")
                        .queryParam("serviceKey", serviceKey)
                        .queryParam("numOfRows", numOfRows)
                        .queryParam("pageNo", pageNo)
                        .queryParam("statId", stateId)
                        .build())
                .retrieve()
                .bodyToMono(String.class)
                .block();

        System.out.println(response);
        return response;

    }

    public RsData<HashMap>  findFromApi3(String statId){
        WebClient webClient = WebClient.create();

        String serviceKey = "%2B61CsEc7Nmo65NvzqtjoQh0FPR0CAdc45WlyZDPkxYDqeSxUJ4E1ncpqn2H2qyN%2BHFXNqJD6JbNbghaWu9Tctw%3D%3D";
        String numOfRows = "100";
        String pageNo = "1";

        URI uri = UriComponentsBuilder.fromUriString("https://apis.data.go.kr/B552584/EvCharger/getChargerInfo")
                .queryParam("serviceKey", serviceKey)
                .queryParam("numOfRows", numOfRows)
                .queryParam("pageNo", pageNo)
                .queryParam("statId", statId)
                .build(true)
                .toUri();

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


        RsData< HashMap > rsData = RsData.of(hashMap);


        return rsData;
    }






}
