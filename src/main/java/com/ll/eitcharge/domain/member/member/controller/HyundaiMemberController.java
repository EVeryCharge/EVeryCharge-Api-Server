package com.ll.eitcharge.domain.member.member.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ll.eitcharge.domain.member.member.entity.Member;
import com.ll.eitcharge.domain.member.member.service.HyundaiTokenService;
import com.ll.eitcharge.domain.member.member.service.MemberService;
import com.ll.eitcharge.global.app.AppConfig;
import com.ll.eitcharge.global.rq.Rq;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.io.IOException;
import java.util.Map;

@Controller
@RequiredArgsConstructor
public class HyundaiMemberController {

    private final HyundaiTokenService hyundaiTokenService;
    private final MemberService memberService;
    private final Rq rq;

    @Transactional
    @RequestMapping(value = "/hyundai") //설정한 redirect_uri에 맞게 정의
    public String getAccessToken(@RequestParam(value = "code") String code,
                                 @RequestParam(value = "state") String state,
                                 HttpServletResponse response
    ) throws IOException {


        String requestBody = "grant_type=authorization_code&code=" + code + "&redirect_uri=" + "http://api.eitcharge.site/hyundai";
        String tokenResponse = hyundaiTokenService.tokenAPICall(requestBody);

        ObjectMapper accessTokenObjectMapper = new ObjectMapper();
        JsonNode TokenRoot = accessTokenObjectMapper.readTree(tokenResponse);
        String accessToken = TokenRoot.path("access_token").asText(); // Response에서 AccessToken 값 추출
//        String refreshToken = TokenRoot.path("refresh_token").asText(); // Response에서 refreshToken 값 추출

        // 유저 정보
        hyundaiTokenService.userProfile(accessToken);

        Map<String, String> carInfo = hyundaiTokenService.getFirstCarInfo(accessToken);
        String carId = carInfo.get("carId");
        String carSellname = carInfo.get("carSellname");



        Member member = memberService.findByUsername(state).get();
        memberService.carInit(member, carSellname);



        System.out.println("배터리 " +hyundaiTokenService.getBattery(carId, accessToken));

        return "redirect:" + AppConfig.getSiteFrontUrl() + "/my";
    }

}