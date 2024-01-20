package com.ll.eitcharge;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class EItChargeApplication {

    public static void main(String[] args) {
        SpringApplication.run(EItChargeApplication.class, args);
    }

}
