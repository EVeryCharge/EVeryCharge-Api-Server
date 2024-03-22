package com.ll.eitcharge.domain.member.member.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ll.eitcharge.domain.member.member.service.HyundaiTokenService;
import com.ll.eitcharge.global.app.AppConfig;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.io.IOException;

@Controller
@RequiredArgsConstructor
public class HyundaiMemberController {

    private final HyundaiTokenService hyundaiTokenService;


    @RequestMapping(value = "/hyundai") //설정한 redirect_uri에 맞게 정의
    public String getAccessToken(@RequestParam(value="code") String code,
                               @RequestParam(value="state") String state,
                               HttpServletResponse response) throws IOException {
        System.out.println("code = " + code);
        System.out.println("state = " + state);
        String requestBody = "grant_type=authorization_code&code=" + code + "&redirect_uri=" + "http://localhost:8090/hyundai";
        String tokenResponse = hyundaiTokenService.tokenAPICall(requestBody);

        ObjectMapper accessTokenObjectMapper = new ObjectMapper();
        JsonNode TokenRoot = accessTokenObjectMapper.readTree(tokenResponse);
        String accessToken = TokenRoot.path("access_token").asText(); // Response에서 AccessToken 값 추출
        String refreshToken = TokenRoot.path("refresh_token").asText(); // Response에서 refreshToken 값 추출
        System.out.println("accessToken = " + accessToken);
        System.out.println("refreshToken = " + refreshToken);

        return "redirect:" + AppConfig.getSiteFrontUrl() + "/my";
    }


}