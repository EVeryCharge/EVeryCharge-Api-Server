package com.ll.eitcharge.domain.chargingStation.chargingStation.repository;

import com.ll.eitcharge.domain.chargingStation.chargingStation.entity.ChargingStation;
import com.ll.eitcharge.domain.chargingStation.chargingStation.entity.QChargingStation;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.BooleanTemplate;

import java.util.List;

@RequiredArgsConstructor
public class ChargingStationRepositoryImpl implements ChargingStationRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    @Override
    public List<ChargingStation> search(String limitYn, String parkingFree, String zcode, String zscode,String isPrimary, String busiId, String chgerType, String kw) {
        return queryFactory
                .selectFrom(QChargingStation.chargingStation)
                .where(
                        isLimitYn(limitYn),
                        isParkingFree(parkingFree),
                        isZcode(zcode),
                        isZscode(zscode),
                        isPrimary(isPrimary),
                        isBusiId(busiId),
                        isChgerType(chgerType),
                        isKw(kw)
                )
                .fetch();
    }

    // Helper methods for conditions
    private BooleanExpression isLimitYn(String limitYn) {
        return limitYn.isEmpty() ? null : QChargingStation.chargingStation.limitYn.eq(limitYn);
    }

    private BooleanExpression isParkingFree(String parkingFree) {
        return parkingFree.isEmpty() ? null : QChargingStation.chargingStation.parkingFree.eq(parkingFree);
    }

    private BooleanExpression isZcode(String zcode) {
        return zcode.isEmpty() ? null : QChargingStation.chargingStation.regionDetail.zcode.regionName.eq(zcode);
    }

    private BooleanExpression isZscode(String zscode) {
        return zscode.isEmpty() ? null : QChargingStation.chargingStation.regionDetail.regionDetailName.eq(zscode);
    }

    private BooleanExpression isBusiId(String busiId) {
        return busiId.isEmpty() ? null : QChargingStation.chargingStation.operatingCompany.bnm.eq(busiId);
    }

    private BooleanExpression isChgerType(String chgerType) {
        return chgerType.isEmpty() ? null : QChargingStation.chargingStation.chargers.any().chgerType.eq(chgerType);
    }

    private BooleanExpression isPrimary(String isPrimary) {
        return isPrimary.isEmpty() ? null : QChargingStation.chargingStation.operatingCompany.isPrimary.eq(isPrimary);
    }

    private BooleanExpression isKw(String kw) {
        // Check if kw is not empty, and if it is not, add the necessary conditions
        if (!kw.isEmpty()) {
            return QChargingStation.chargingStation.statNm.containsIgnoreCase(kw)
                    .or(QChargingStation.chargingStation.addr.containsIgnoreCase(kw));
            // Add more conditions based on the fields you want to search
        }
        return null;
    }
}