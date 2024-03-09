package com.ll.eitcharge.domain.charger.charger.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.ll.eitcharge.domain.charger.charger.entity.Charger;
import com.ll.eitcharge.domain.charger.charger.repository.ChargerRepository;
import com.ll.eitcharge.domain.chargingStation.chargingStation.repository.ChargingStationRepository;
import io.netty.channel.ChannelOption;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.util.UriComponentsBuilder;
import reactor.netty.http.client.HttpClient;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;
import java.net.URI;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static com.ll.eitcharge.global.app.AppConfig.apiServiceKey;
import static com.ll.eitcharge.global.app.AppConfig.objectMapper;

@Service
@RequiredArgsConstructor
public class ChargerService {
    private final ChargerRepository chargerRepository;
    private final ChargingStationRepository chargingStationRepository;

    public void updateChargerStatus() {
        chargerStatusUpdate();

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
    @Async
    public void chargerStatusUpdate() {
        String key = apiServiceKey;
        String baseUrl = "https://apis.data.go.kr/B552584/EvCharger/getChargerStatus";
        //현재는 해당 api의 응답데이터가 10000개를 넘는일은 없을것으로 예상.
        //하지만 추후에 10000개 이상일경우, 리팩토링 필요함
        int numOfRows = 10000;
        int pageNo = 1;
        String jsonType = "JSON";
        int priod = 10;
        HashMap hashMap = webClientApiGetChargerStatus(baseUrl, key, numOfRows, pageNo, jsonType, priod);


        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");

        List<Map<String, Object>> items = (List<Map<String, Object>>) ((Map<String, Object>) hashMap.get("items")).get("item");
        for (Map<String, Object> item : items) {

            String busiId = (String) item.get("busiId");
            String statId = (String) item.get("statId");
            String casting = (String) item.get("chgerId");
            int numberInt = Integer.parseInt(casting);
            String chgerId = String.valueOf(numberInt);
            String stat = (String) item.get("stat");
            LocalDateTime statUpdDt = Optional.ofNullable((String) item.get("statUpdDt"))
                    .filter(s -> !s.isEmpty())
                    .map(s -> LocalDateTime.parse(s, formatter))
                    .orElse(null);
            LocalDateTime lastTsdt = Optional.ofNullable((String) item.get("lastTsdt"))
                    .filter(s -> !s.isEmpty())
                    .map(s -> LocalDateTime.parse(s, formatter))
                    .orElse(null);
            LocalDateTime lastTedt = Optional.ofNullable((String) item.get("lastTedt"))
                    .filter(s -> !s.isEmpty())
                    .map(s -> LocalDateTime.parse(s, formatter))
                    .orElse(null);
            LocalDateTime nowTsdt = Optional.ofNullable((String) item.get("nowTsdt"))
                    .filter(s -> !s.isEmpty())
                    .map(s -> LocalDateTime.parse(s, formatter))
                    .orElse(null);

            chargingStationRepository.findById(statId)
                    //충전소가 존재할때
                    .map(chargingStation -> {



                        return chargerRepository.findByChargingStationStatIdAndChgerId(statId,chgerId)
                                //해당 충전소의 충전기가 존재할때
                                .map(charger -> {
                                    charger.toBuilder()
                                            .stat(stat)
                                            .statUpdDt(statUpdDt)
                                            .lastTsdt(lastTsdt)
                                            .lastTedt(lastTedt)
                                            .nowTsdt(nowTsdt)
                                            .build();
                                    System.out.println("충전소 업데이트 성공 1-1");
                                    return chargerRepository.save(charger);
                                })
                                .orElseGet(() -> {
                                    //해당 충전소의 충전기가 존재하지 않을때
                                    // 새 충전기 생성 후 저장
                                    Charger charger = Charger.builder()
                                            .chargingStation(chargingStation)
                                            .stat(stat)
                                            .chgerId(chgerId)
                                            .statUpdDt(statUpdDt)
                                            .lastTsdt(lastTsdt)
                                            .lastTedt(lastTedt)
                                            .nowTsdt(nowTsdt)
                                            .build();
                                    // 파일에 로그 메시지를 저장
                                    // 아마 기존의 충전소에 새롭게 충전기가 설치될경우 이 로직을 타게될듯
                                    // 해당 파일은 배치를 통해 api요청으로
                                    String logMessage = charger.getChargingStation().getStatId() + "," + charger.getChgerId() + "," + charger.getStat();
                                    try (BufferedWriter writer = new BufferedWriter(new FileWriter("batch/NoCharger.txt", true))) {
                                        writer.write(logMessage);
                                        writer.newLine();
                                    } catch (IOException e) {
                                        // 파일 쓰기 실패 시 예외 처리
                                        e.printStackTrace();
                                    }
                                    System.out.println("충전소 업데이트 성공 1-2");
                                    return chargerRepository.save(charger);
                                });
                    })
                    //충전소가 존재하지 않을때
                    .orElseGet(()->{
                        String logMessage = statId;
                        try (BufferedWriter writer = new BufferedWriter(new FileWriter("batch/NoChargingStation.txt", true))) {
                            writer.write(logMessage);
                            writer.newLine();
                        } catch (IOException e) {
                            // 파일 쓰기 실패 시 예외 처리
                            e.printStackTrace();
                        }
                        return null;
                        }


                    );

        }
        String logMessage = LocalDateTime.now() + "충전기 상태 업데이트 스케줄러 작업 완료";
        try (BufferedWriter writer = new BufferedWriter(new FileWriter("log/schedulerCompletLog.txt", true))) {
            writer.write(logMessage);
            writer.newLine();
        } catch (IOException e) {
            // 파일 쓰기 실패 시 예외 처리
            e.printStackTrace();
        }


    }
}