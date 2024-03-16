package com.ll.eitcharge.domain.charger.chargerState.service;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.data.redis.core.Cursor;
import org.springframework.data.redis.core.RedisCallback;
import org.springframework.data.redis.core.ScanOptions;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import com.ll.eitcharge.domain.charger.charger.entity.Charger;
import com.ll.eitcharge.domain.charger.chargerState.form.ChargerStateUpdateForm;
import com.ll.eitcharge.standard.util.Ut;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChargerStateRedisService {
	private final StringRedisTemplate redisTemplate;

	/**
	 * DB의 모든 충전기 상태 정보를 레디스에 저장한다. / 최초 init시 실행
	 * @param list 충전소 리스트
	 */
	public void initChargersToRedis(List<Charger> list) {
		redisTemplate.executePipelined((RedisCallback<Void>)connection -> {
			list.forEach(charger -> {
				String key = String.format("%s_%s", charger.getChargingStation().getStatId(), charger.getChgerId());
				String value = charger.getStat();
				redisTemplate.opsForValue().set(key, value);
			});
			return null;
		});

		log.info("[Redis](init) : DB 충전기 상태 데이터 {}건 불러오기 완료", list.size());
	}

	/**
	 * Redis 로직 1 /
	 * Redis에 존재하는 key값에 한해 인자의 hashMap의 value로 업데이트 후 업데이트된 hashMap을 리턴한다.
	 * @param list : OpenAPI로 갱신된 충전소ID, 충전기ID, 충전기 상태, 업데이트 날짜
	 * @return updatedList : Redis에 갱신된 충전소ID, 충전기ID, 충전기 상태, 업데이트 날짜
	 */
	public List<ChargerStateUpdateForm> updateExistingChargersToRedis(List<ChargerStateUpdateForm> list) {
		List<ChargerStateUpdateForm> updatedList = new ArrayList<>();

		redisTemplate.executePipelined((RedisCallback<Void>)connection -> {
			for (ChargerStateUpdateForm charger : list) {
				String key = String.format("%s_%s", charger.getStatId(), charger.getChgerId());
				String value = charger.getStat();

				if (redisTemplate.hasKey(key)) {
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
	 * Redis 로직 2 (비교) /
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

		log.info("[Redis] : OpenApi 충전기 데이터 {}개 중 DB 미존재 충전기 데이터 {} 필터링 완료", list.size(), filteredList.size());
		Ut.calcHeapMemory();
		return filteredList;
	}

	/**
	 * Redis 로직 2 (추가) /
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
		log.info("[Redis] : DB 미존재 충전기 충전기 정보 {}개 저장 완료", keySet.size());
		Ut.calcHeapMemory();
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
