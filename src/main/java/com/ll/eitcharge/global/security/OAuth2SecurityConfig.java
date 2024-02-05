package com.ll.eitcharge.global.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@RequiredArgsConstructor
public class OAuth2SecurityConfig {
    private final CustomAuthenticationSuccessHandler customAuthenticationSuccessHandler;
    private final ASuccessHandler aSuccessHandler;

    @Bean
    public SecurityFilterChain OAuthFilterChain(HttpSecurity http) throws Exception {
        http
                .authorizeRequests(authorizeRequests ->
                        authorizeRequests
                                .requestMatchers("/gen/**")
                                .permitAll()
                                .requestMatchers("/resource/**")
                                .permitAll()
                                .requestMatchers("/h2-console/**")
                                .permitAll()
                                .anyRequest()
                                .permitAll()
                )
                .headers(
                        headers ->
                                headers.frameOptions(
                                        frameOptions ->
                                                frameOptions.sameOrigin()
                                )
                )
                .csrf(
                        csrf ->
                                csrf.ignoringRequestMatchers(
                                        "/h2-console/**"
                                )
                )
                .oauth2Login(
                        oauth2Login ->
                                oauth2Login
                                        .successHandler(aSuccessHandler)

                );

        return http.build();
    }
}
