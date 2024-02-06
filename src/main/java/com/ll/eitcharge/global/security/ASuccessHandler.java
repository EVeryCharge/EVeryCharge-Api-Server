package com.ll.eitcharge.global.security;

import com.ll.eitcharge.domain.member.member.entity.Member;
import com.ll.eitcharge.domain.member.member.service.AuthTokenService;
import com.ll.eitcharge.domain.member.member.service.MemberService;
import com.ll.eitcharge.global.rq.Rq;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URLEncoder;

@Component
@RequiredArgsConstructor
public class ASuccessHandler implements AuthenticationSuccessHandler {

    private final AuthTokenService authTokenService;
    private final MemberService memberService;
    private final Rq rq;

    @Value("${custom.dev.frontUrl}")
    private String frontUrl;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {

        Member member = memberService.findByUsername(authentication.getName()).get();
        String accessToken = authTokenService.genAccessToken(member);
        String refreshToken = member.getRefreshToken();


        String redirectUrlAfterSocialLogin = rq.getCookieValue("redirectUrlAfterSocialLogin", "");

        ResponseCookie accessTokenCookie = ResponseCookie.from("accessToken", accessToken)
                .path("/")
                .domain("localhost")
                .sameSite("Strict")
                .secure(true)
                .httpOnly(true)
                .build();

        ResponseCookie refreshTokenCookie = ResponseCookie.from("refreshToken", refreshToken)
                .path("/")
                .domain("localhost")
                .sameSite("Strict")
                .secure(true)
                .httpOnly(true)
                .build();

        response.addHeader("Set-Cookie", accessTokenCookie.toString());
        response.addHeader("Set-Cookie", refreshTokenCookie.toString());


        Cookie[] cookies = request.getCookies();

        Cookie cookie1 = null;
        for (Cookie cookie : cookies) {
            if (cookie.getName().equals(redirectUrlAfterSocialLogin)) {
                cookie1 = cookie;
            }
        }


        if (cookie1 != null) {
            cookie1.setPath("/");
            cookie1.setMaxAge(0);
            response.addCookie(cookie1);
        }

        String userName = member.getName();
        String redirectUrlWithUsername = frontUrl + "?kakaousername=" + URLEncoder.encode(userName, "UTF-8");

        response.sendRedirect(redirectUrlWithUsername);
    }
}
