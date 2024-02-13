package com.ll.eitcharge.domain.charger.charger.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.ll.eitcharge.domain.charger.charger.repository.ChargerRepository;
import com.ll.eitcharge.domain.charger.chargerScheduler.StreamItem;
import com.ll.eitcharge.global.rsData.RsData;
import jakarta.xml.bind.JAXBContext;
import jakarta.xml.bind.JAXBException;
import jakarta.xml.bind.Unmarshaller;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.util.UriComponentsBuilder;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.io.StringReader;
import java.net.URI;
import java.util.HashMap;
import java.util.List;

import static com.ll.eitcharge.global.app.AppConfig.apiServiceKey;
import static com.ll.eitcharge.global.app.AppConfig.objectMapper;

@Service
@RequiredArgsConstructor
public class ChargerService {
    private final ChargerRepository chargerRepository;
    public RsData<Object> findFromApi() {
        WebClient webClient = WebClient.create();
        String serviceKey = apiServiceKey;

        int numOfRows = 10000;
        int pageNo = 1;

        URI uri = UriComponentsBuilder.fromUriString("https://apis.data.go.kr/B552584/EvCharger/getChargerStatus")
                .queryParam("serviceKey", serviceKey)
                .queryParam("numOfRows", numOfRows)
                .queryParam("pageNo", pageNo)
                .build(true)
                .toUri();

        String response = webClient.get()
                .uri(uri)
                .header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
                .retrieve()
                .bodyToMono(String.class)
                .block();


        System.out.println("reponse : " + response);
        HashMap hashMap = null;
        try {
            hashMap = objectMapper.readValue(response, HashMap.class);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("JSON 파싱 오류", e);
        }
        System.out.println("hashMap : " + hashMap);

        RsData<Object> rsData = RsData.of(hashMap.get("items"));

        return rsData;
    }
    public Flux<Object> apiStream() {
        WebClient webClient = WebClient.create();
        String serviceKey = apiServiceKey;

        int numOfRows = 10000;
        int pageNo = 1;
        return Flux.range(0, Integer.MaxValue)
                .flatMap(i -> {
                    URI uri = UriComponentsBuilder.fromUriString("https://apis.data.go.kr/B552584/EvCharger/getChargerStatus")
                            .queryParam("serviceKey", serviceKey)
                            .queryParam("numOfRows", numOfRows)
                            .queryParam("pageNo", pageNo)
                            .build(true)
                            .toUri();

                    Flux<Object> flux = webClient.get()
                            .uri(uri)
                            .header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
                            .retrieve()
                            .bodyToFlux(Object.class);

                    return flux;
                });

    }
    public Flux<Object> streamData() {
        WebClient webClient = WebClient.create();
        String serviceKey = apiServiceKey;

        int numOfRows = 10000;
        int pageNo = 1;
        URI uri = UriComponentsBuilder.fromUriString("https://apis.data.go.kr/B552584/EvCharger/getChargerStatus")
                .queryParam("serviceKey", serviceKey)
                .queryParam("numOfRows", numOfRows)
                .queryParam("pageNo", pageNo)
                .build(true)
                .toUri();

        return webClient.get()
                .uri(uri)
                .accept(MediaType.APPLICATION_STREAM_JSON)
                .exchange()
                .flatMapMany(clientResponse -> clientResponse.bodyToFlux(String.class));
    }
    public void updateChargerStatus() {
        streamData()
                .map(this::convertXmlToItems) // XML을 Java 객체로 변환
                .flatMap(Flux::fromIterable) // Flux<List<Item>>을 Flux<Item>으로 변환
                .flatMap(this::saveOrUpdateItem) // 각 Item을 DB에 저장하거나 업데이트
                .subscribe(); // 스트림 시작
    }


    private List<StreamItem> convertXmlToItems(String xml) {
        try {
            JAXBContext jaxbContext = JAXBContext.newInstance(Response.class);
            Unmarshaller unmarshaller = jaxbContext.createUnmarshaller();
            Response response = (Response) unmarshaller.unmarshal(new StringReader(xml));
            return response.getBody().getItems().getItem();
        } catch (JAXBException e) {
            throw new RuntimeException("XML 파싱 오류", e);
        }
    }

    private Mono<Item> saveOrUpdateItem(Item item) {
        return chargerRepository.findById(item.getStatId())
                .flatMap(existingItem -> {
                    // 기존에 존재하는 항목이면 업데이트
                    existingItem.update(item);
                    return chargerRepository.save(existingItem);
                })
                .switchIfEmpty(chargerRepository.save(item)); // 존재하지 않는 항목이면 삽입
    }


}
