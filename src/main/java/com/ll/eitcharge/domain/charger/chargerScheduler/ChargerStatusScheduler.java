package com.ll.eitcharge.domain.charger.chargerScheduler;

import com.ll.eitcharge.domain.charger.charger.service.ChargerService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ChargerStatusScheduler {

    private final ChargerService chargerService;
//     3 * 60 * 1000 3분
    @Scheduled(fixedRate =  10000) // 1초마다 실행
    public void updateChargerStatus() {
        chargerService.updateChargerStatus();
    }
}
