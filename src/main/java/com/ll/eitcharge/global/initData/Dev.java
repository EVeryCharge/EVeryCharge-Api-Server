package com.ll.eitcharge.global.initData;

import com.ll.eitcharge.domain.member.member.service.MemberService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.context.annotation.Profile;
import org.springframework.core.annotation.Order;
import org.springframework.transaction.annotation.Transactional;

import java.util.stream.IntStream;

//프로필이 dev일 때만 실행하고 member를 10명 생성
@Configuration
@Profile("dev")
@Slf4j
@RequiredArgsConstructor
public class Dev {
    @Autowired
    @Lazy
    private Dev self;
    private final MemberService memberService;

    @Bean
    @Order(3)
    public ApplicationRunner initNotProd() {
        return args -> {
            self.work1();
        };


    }
    @Transactional
    public void work1(){
        // 이미 회원이 존재하는 경우 초기화를 수행하지 않음
        if (memberService.findByUsername("user1").isPresent()) return;
        //유저 10명 생성
        //스트림으로 우아하게 바꿔줘
        IntStream.rangeClosed(1, 10).forEach(i ->{
            memberService.join("user"+i,"123");
        });
    }



}
