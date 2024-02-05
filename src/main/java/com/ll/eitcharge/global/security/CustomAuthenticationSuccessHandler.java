package com.ll.eitcharge.global.security;

import com.ll.eitcharge.domain.member.member.service.AuthTokenService;
import com.ll.eitcharge.global.rq.Rq;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SavedRequestAwareAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;

@Component
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CustomAuthenticationSuccessHandler extends SavedRequestAwareAuthenticationSuccessHandler {
    private final Rq rq;
    private final AuthTokenService authTokenService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, FilterChain chain, Authentication authentication) throws IOException, ServletException {
        String redirectUrlAfterSocialLogin = rq.getCookieValue("redirectUrlAfterSocialLogin", "");

        String accessToken = authTokenService.genAccessToken(rq.getMember());
        String refreshToken = rq.getMember().getRefreshToken();

        rq.destroySession();
        rq.setCrossDomainCookie("accessToken", accessToken);
        rq.setCrossDomainCookie("refreshToken", refreshToken);
        rq.removeCookie("redirectUrlAfterSocialLogin");

        response.sendRedirect(redirectUrlAfterSocialLogin);
        return;
    }
}
