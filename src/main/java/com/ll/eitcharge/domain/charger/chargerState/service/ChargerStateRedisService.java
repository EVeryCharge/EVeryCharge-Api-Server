package com.ll.eitcharge.domain.charger.chargerState.service;

import java.nio.charset.StandardCharsets;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.data.redis.core.Cursor;
import org.springframework.data.redis.core.RedisCallback;
import org.springframework.data.redis.core.ScanOptions;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import com.ll.eitcharge.domain.charger.chargerState.form.ChargerStateUpdateForm;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChargerStateRedisService {
	private final StringRedisTemplate redisTemplate;


	/**
	 * Redis 로직 (write-through, API → Redis) /
	 * Redis에 존재하는 key값 (DB상 없는 충전소ID_충전기ID)를 입력받은 인자와 비교해 걸러낸다.
	 * @param list OpenAPI상 충전소 데이터 리스트
	 * @return list Redis에 존재, DB에 없는 충전기 리스트를 필터링한 리스트
	 */
	public List<ChargerStateUpdateForm> filterExistingChargersFromRedis(List<ChargerStateUpdateForm> list) {
		Set<String> existingKeys = new HashSet<>();

		redisTemplate.executeWithStickyConnection(connection -> {
			Cursor<byte[]> cursor = connection.scan(ScanOptions.scanOptions().match("*").build());
			try {
				cursor.forEachRemaining(keyBytes -> existingKeys.add(new String(keyBytes, StandardCharsets.UTF_8)));
			} finally {
				cursor.close();
			}
			return null;
		});

		List<ChargerStateUpdateForm> filteredList = list.stream()
			.filter(charger ->
				!existingKeys.contains(String.format("%s_%s", charger.getStatId(), charger.getChgerId()))
			)
			.toList();

		log.info("[Redis] : DB 미존재 충전기 데이터 {}개 필터링 완료", list.size() - filteredList.size());
		return filteredList;
	}

	/**
	 * Redis 로직 2 (write-through, DB → Redis) /
	 * DB에 없는 충전소_충전기ID key를 Redis에 추가한다.
	 * @param keySet DB에 존재하지 않는 충전소_충전기ID key, Redis에 업데이트할 key
	 */
	public void updateNonExistingChargersToRedis(Set<String> keySet) {
		redisTemplate.executePipelined((RedisCallback<Void>)connection -> {
				for (String key : keySet)
					redisTemplate.opsForValue().set(key, "없음");
				return null;
			}
		);
		log.info("[Redis] : DB 미존재 충전기 정보 {}개 Redis 저장 완료", keySet.size());
	}

	/**
	 * Redis에 존재하는 모든 key, value를 삭제한다. (초기화) /
	 * 충전소, 충전기 전역 업데이트 시 사용
	 */
	public void flushAll() {
		redisTemplate.execute((RedisCallback<Void>)connection -> {
			connection.serverCommands().flushAll();
			log.info("[Redis](init) : redis flushAll 완료");
			return null;
		});
	}
}
