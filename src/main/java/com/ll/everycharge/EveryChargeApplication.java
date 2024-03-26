package com.ll.everycharge;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
@EnableJpaAuditing
@EnableCaching
public class EveryChargeApplication {

    public static void main(String[] args) {
        SpringApplication.run(EveryChargeApplication.class, args);
    }

}
