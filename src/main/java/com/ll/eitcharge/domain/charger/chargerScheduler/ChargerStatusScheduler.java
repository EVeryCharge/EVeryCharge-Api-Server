package com.ll.eitcharge.domain.charger.chargerScheduler;

import com.ll.eitcharge.domain.charger.charger.service.ChargerService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Profile;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@Profile("prod")
@RequiredArgsConstructor
public class ChargerStatusScheduler {

    private final ChargerService chargerService;

//     @Scheduled(initialDelay = 5 * 60 * 1000, fixedRate = 3 * 60 * 1000) // 초기 지연 시간 5분, 그 후 3분마다 실행
     @Scheduled(fixedRate = 3 * 60 * 1000) // 초기 지연 시간 5분, 그 후 3분마다 실행
     public void updateChargerStatus() {
         chargerService.updateChargerStatus();
     }

}
