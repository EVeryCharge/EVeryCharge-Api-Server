package com.ll.eitcharge.domain.charger.chargerState.service;

import static lombok.AccessLevel.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.concurrent.atomic.AtomicInteger;

import org.springframework.data.redis.core.RedisCallback;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ll.eitcharge.domain.charger.chargerState.form.ChargerStateUpdateForm;
import com.ll.eitcharge.domain.chargingStation.chargingStation.entity.ChargingStation;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ChargerStateRedisService {
	private final StringRedisTemplate redisTemplate;

	@Getter
	@Setter
	@Builder
	@NoArgsConstructor(access = PROTECTED)
	@AllArgsConstructor(access = PROTECTED)
	public static class RedisMap {
		private String key;
		private String value;
	}

	/**
	 * 충전소 리스트를 입력받아 해당 충전소의 모든 충전기 상태 정보를 레디스에 저장한다.
	 * @param 충전소 리스트
	 * redis (key, value) : 충전소ID_충전기ID, 충전기 상태
	 * [참고] 최초 스프링부트 실행 시 모든 충전기 정보를 저장할 시 사용
	 */
	public void setChargersToRedisByChargingStationList(List<ChargingStation> list) {
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
						}))
			.toList();

		log.info("[Redis](init) : DB 충전기 상태 데이터 {}건 불러오기 완료", listConvertedByMap.size());

		AtomicInteger execCount = new AtomicInteger();
		redisTemplate.executePipelined((RedisCallback<Object>)connection -> {
				listConvertedByMap.forEach(map -> {
						redisTemplate.opsForValue().set(map.getKey(), map.getValue());
						execCount.getAndIncrement();
					}
				);
				if (execCount.get() < 0) {
					log.error("[ERROR] : Redis 데이터 저장 실패");
				}
				log.info("[Redis](init) : DB 충전기 상태 데이터 {}건 중 {}건 Redis 저장 완료", execCount, listConvertedByMap.size());
				return null;
			}
		);
	}

	/**
	 * Redis 로직 1
	 * Redis에 존재하는 key값에 한해 인자의 hashMap의 value로 업데이트 후 업데이트된 hashMap을 리턴한다.
	 * @param list : 오픈API로 갱신된 충전소ID, 충전기ID, 충전기 상태, 업데이트 날짜
	 * @return list : redis에 갱신된 충전소ID, 충전기ID, 충전기 상태, 업데이트 날짜
	 */
	public List<ChargerStateUpdateForm> updateExistingChargersToRedis(List<ChargerStateUpdateForm> list) {
		List<ChargerStateUpdateForm> updatedList = new ArrayList<>();

		redisTemplate.executePipelined((RedisCallback<Void>)connection -> {
			for (ChargerStateUpdateForm charger : list) {
				String key = String.format("%s_%s", charger.getStatId(), charger.getChgerId());
				String value = charger.getStat();

				if (redisTemplate.hasKey(key) && !redisTemplate.opsForValue().get(key).equals(value)) {
					redisTemplate.opsForValue().set(key, value);
					updatedList.add(charger);
				}
			}
			return null;
		});
		if (!list.isEmpty() && updatedList.isEmpty()) {
			log.error("[ERROR] : Redis 데이터 저장 실패");
		}
		log.info("[Redis](scheduler) : OpenAPI 충전기 상태 {}건 중 변화 감지 {}건 Redis 저장 완료", list.size(), updatedList.size());
		return updatedList;
	}

	/**
	 * Redis 로직 2
	 * Redis에 존재하는 key값 (DB상 없는 충전소ID_충전기ID)를 입력받은 인자와 비교해 걸러낸다.
	 * @return filteredChargersList
	 */
	public List<ChargerStateUpdateForm> filterExistingChargersFromRedis(List<ChargerStateUpdateForm> list) {
		Set<String> keys = redisTemplate.keys("*");
		if (keys.isEmpty())
			return list;

		return list.stream()
			.filter(charger ->
				!keys.contains(String.format("%s_%s", charger.getStatId(), charger.getChgerId()))).toList();
	}

	/**
	 * Redis에 존재하는 모든 key, value를 삭제한다. (초기화)
	 */
	public void flushAll() {
		redisTemplate.execute((RedisCallback<Void>)connection -> {
			connection.serverCommands().flushAll();
			log.info("[Redis](init) : redis flushAll 완료");
			return null;
		});
	}
}
