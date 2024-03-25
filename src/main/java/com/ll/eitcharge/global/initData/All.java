package com.ll.eitcharge.global.initData;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.core.annotation.Order;

import com.ll.eitcharge.domain.chargeFee.chargeFee.service.ChargeFeeService;
import com.ll.eitcharge.domain.charger.update.chargerState.service.ChargerStateUpdateService;
import com.ll.eitcharge.domain.member.member.service.MemberService;
import com.ll.eitcharge.global.app.AppConfig;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
@Configuration
@Slf4j
@RequiredArgsConstructor
public class All {
    @Autowired
    @Lazy
    private All self;
    private final MemberService memberService;
    private final ChargeFeeService chargeFeeService;
    private final ChargerStateUpdateService chargerStatusUpdateService;

    @Bean
    @Order(2)
    public ApplicationRunner initAll() {
        return args -> {
            this.initSystemAccount();
            this.initChargeFeeData();
            this.initChargeRoamingFeeData();
            AppConfig.isAppInitialized = true;
        };
    }

    public void initSystemAccount() {
        if (memberService.findByUsername("system").isPresent()) return;

        memberService.join("system", "1234");
        memberService.join("admin", "1234");
    }

    public void initChargeFeeData() {
        chargeFeeService.upsertChargeFeeFromApi();
    }

    public void initChargeRoamingFeeData(){
        chargeFeeService.updateChargeRoamingFeeFileFromApi();
    }
}