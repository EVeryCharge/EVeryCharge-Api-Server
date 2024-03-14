package com.ll.eitcharge.domain.charger.chargerState.repository;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.ll.eitcharge.domain.charger.chargerState.form.ChargerStateUpdateForm;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;

@Repository
public class ChargerStateBulkUpdateRepository {

	@PersistenceContext
	private EntityManager entityManager;

	/**
	 * 충전기 상태를 벌크 업데이트한다.
	 * @Note : (Unused) 벌크 업데이트를 사용하기 위해서는 Unique Key가 전제되어야 함
	 */
	public void bulkUpdateChargerState(List<ChargerStateUpdateForm> list) {
		String nativeQuery = "INSERT INTO charger (stat_id, chger_id, stat, stat_upd_dt, last_tsdt, last_tedt, now_tsdt) VALUES ";
		for (int i = 0; i < list.size(); i++) {
			ChargerStateUpdateForm dto = list.get(i);
			nativeQuery += "(?, ?, ?, ?, ?, ?, ?)";
			if (i < list.size() - 1) {
				nativeQuery += ",";
			}
		}
		nativeQuery += " ON DUPLICATE KEY UPDATE "
			+ "stat = VALUES(stat), "
			+ "stat_upd_dt = VALUES(stat_upd_dt), "
			+ "last_tsdt = VALUES(last_tsdt), "
			+ "last_tedt = VALUES(last_tedt), "
			+ "now_tsdt = VALUES(now_tsdt); ";

		Query query = entityManager.createNativeQuery(nativeQuery);

		int parameterIndex = 1;
		for (ChargerStateUpdateForm dto : list) {
			query.setParameter(parameterIndex++, dto.getStatId());
			query.setParameter(parameterIndex++, dto.getChgerId());
			query.setParameter(parameterIndex++, dto.getStat());
			query.setParameter(parameterIndex++, dto.getStatUpdDt());
			query.setParameter(parameterIndex++, dto.getLastTsdt());
			query.setParameter(parameterIndex++, dto.getLastTedt());
			query.setParameter(parameterIndex++, dto.getNowTsdt());
		}

		query.executeUpdate();
	}
}
