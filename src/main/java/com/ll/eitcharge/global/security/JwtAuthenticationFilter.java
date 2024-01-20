package com.ll.eitcharge.global.security;


import com.ll.eitcharge.domain.member.member.service.MemberService;
import com.ll.eitcharge.global.rq.Rq;
import com.ll.eitcharge.global.rsData.RsData;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final Rq rq;
    private final MemberService memberService;

    @Override
    @SneakyThrows
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) {
        if (!request.getRequestURI().startsWith("/api/")) {
            filterChain.doFilter(request, response);
            return;
        }

        if (List.of("/api/v1/members/login", "/api/v1/members/join").contains(request.getRequestURI())) {
            filterChain.doFilter(request, response);
            return;
        }

        String bearerToken = rq.getHeader("Authorization", null);

        if (bearerToken != null) {
            // 토큰이 헤더로 들어온 경우
            String tokensStr = bearerToken.substring("Bearer ".length());
            String[] tokens = tokensStr.split(" ", 2);
            String refreshToken = tokens[0];
            String accessToken = tokens.length == 2 ? tokens[1] : "";

            // 엑세스 토큰이 존재하면
            if (!accessToken.isBlank()) {
                // 유효성 체크하여 만료되었으면 리프레시 토큰으로 새로운 엑세스 토큰을 발급받고 응답헤더에 추가
                if (!memberService.validateToken(accessToken)) {
                    RsData<String> rs = memberService.refreshAccessToken(refreshToken);
                    accessToken = rs.getData();
                    rq.setHeader("Authorization", "Bearer " + refreshToken + " " + accessToken);
                }

                SecurityUser securityUser = memberService.getUserFromAccessToken(accessToken);
                // 세션에 로그인하는 것이 아닌 1회성(이번 요청/응답 생명주기에서만 인정됨)으로 로그인 처리
                // API 요청은, 로그인이 필요하다면 이렇게 매번 요청마다 로그인 처리가 되어야 하는게 맞다.
                rq.setLogin(securityUser);
            }
        } else {
            // 토큰이 쿠키로 들어온 경우
            String accessToken = rq.getCookieValue("accessToken", "");

            // 엑세스 토큰이 존재하면
            if (!accessToken.isBlank()) {
                // 유효성 체크하여 만료되었으면 리프레시 토큰으로 새로운 엑세스 토큰을 발급받고 응답쿠키에 추가
                if (!memberService.validateToken(accessToken)) {
                    String refreshToken = rq.getCookieValue("refreshToken", "");

                    RsData<String> rs = memberService.refreshAccessToken(refreshToken);
                    accessToken = rs.getData();
                    rq.setCrossDomainCookie("accessToken", accessToken);
                }

                SecurityUser securityUser = memberService.getUserFromAccessToken(accessToken);
                // 세션에 로그인하는 것이 아닌 1회성(이번 요청/응답 생명주기에서만 인정됨)으로 로그인 처리
                // API 요청은, 로그인이 필요하다면 이렇게 매번 요청마다 로그인 처리가 되어야 하는게 맞다.
                rq.setLogin(securityUser);
            }
        }

        filterChain.doFilter(request, response);
    }
}