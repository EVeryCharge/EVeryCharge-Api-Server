package com.ll.eitcharge.global.redis;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;

import jakarta.annotation.PreDestroy;

@Configuration
public class RedisConfig {

	@Value("${spring.data.redis.host}")
	private String host;

	@Value("${spring.data.redis.port}")
    private int port;

	@Value("${spring.data.redis.password}")
	private String password;

	private LettuceConnectionFactory lettuceConnectionFactory;

	@Bean
	public RedisConnectionFactory redisConnectionFactory(){
		RedisStandaloneConfiguration config = new RedisStandaloneConfiguration(host,  port);
		config.setPassword(password);
		return new LettuceConnectionFactory(config);
	}

	@PreDestroy
	public void flushRedisOnShutdown() {
		lettuceConnectionFactory.getConnection().serverCommands().flushAll();
	}
}
