package com.ll.eitcharge.global.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class ApiSecurityConfig {
	private final JwtAuthenticationFilter jwtAuthenticationFilter;

	@Bean
	@Order(2)
	SecurityFilterChain apiFilterChain(HttpSecurity http) throws Exception {
		http
			.securityMatcher("/api/**")
			.authorizeRequests(
				authorizeRequests -> authorizeRequests
					.requestMatchers(HttpMethod.GET, "/api/*/posts/{id:\\d+}", "/api/*/posts")
					.permitAll()
					.requestMatchers("/api/*/members/login", "/api/*/members/logout")
					.permitAll()
					.requestMatchers(HttpMethod.GET, "/api/*/reports/{id:\\d+}", "/api/*/reports/list")
					.permitAll()
					// todo : 개발 완료된 api는 분류해서 넣을 것
					.anyRequest()
					.authenticated()
			)
			.csrf(
				csrf -> csrf
					.disable()
			)
			.sessionManagement(
				sessionManagement -> sessionManagement
					.sessionCreationPolicy(
						SessionCreationPolicy.STATELESS
					)
			)
			.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

		return http.build();
	}
}