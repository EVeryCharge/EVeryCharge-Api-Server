package com.ll.eitcharge.domain.charger.charger.service;

import static lombok.AccessLevel.*;

import java.util.List;

import org.springframework.data.redis.core.RedisCallback;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ll.eitcharge.domain.chargingStation.chargingStation.entity.ChargingStation;
import com.ll.eitcharge.domain.chargingStation.chargingStation.repository.ChargingStationRepository;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RedisChargerStorageService {
	private final StringRedisTemplate redisTemplate;
	private final ChargingStationRepository chargingStationRepository;

	@Getter
	@Setter
	@Builder
	@NoArgsConstructor(access = PROTECTED)
	@AllArgsConstructor(access = PROTECTED)
	public static class RedisMap {
		private String key;
		private String value;
	}

	public void initChargersToRedis() {
		List<ChargingStation> list = chargingStationRepository.findAll();

		List<RedisMap> listConvertedByMap = list.stream().flatMap(
			chargingStation ->
				chargingStation.getChargers().stream().map(
					charger -> {
						String key = chargingStation.getStatId() + "_" + charger.getChgerId();
						String value = charger.getStat();

						return RedisMap.builder()
							.key(key)
							.value(value)
							.build();
					})).toList();

		redisTemplate.executePipelined((RedisCallback<Object>)connection -> {
				listConvertedByMap.forEach(map ->
					redisTemplate.opsForValue().set(map.getKey(), map.getValue())
				);
				return null;
			}
		);
	}
}
