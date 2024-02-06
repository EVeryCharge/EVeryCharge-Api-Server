package com.ll.eitcharge.domain.chargingStation.chargingStation.repository;

import com.ll.eitcharge.domain.chargingStation.chargingStation.entity.ChargingStation;
import com.ll.eitcharge.domain.chargingStation.chargingStation.entity.QChargingStation;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.JPQLQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.support.PageableExecutionUtils;

import java.util.List;

/**
 * QueryDSL 충전소 검색 로직
 * 작성자: 임지원, 이상제
 */
@RequiredArgsConstructor
public class ChargingStationRepositoryImpl implements ChargingStationRepositoryCustom {
    private final JPAQueryFactory queryFactory;

    @Override
    public Page<ChargingStation> search(String limitYn, String parkingFree, String zcode, String zscode, String isPrimary, List<String> busiIds, List<String> chgerTypes, String kw, Pageable pageable) {

        List<ChargingStation> results = queryFactory
                .selectFrom(QChargingStation.chargingStation)
                .where(
                        isLimitYn(limitYn),
                        isParkingFree(parkingFree),
                        isZcode(zcode),
                        isZscode(zscode),
                        isPrimary(isPrimary),
                        isBusiId(busiIds),
                        isChgerType(chgerTypes),
                        isKw(kw)
                )
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();


        JPQLQuery<ChargingStation> countQuery = queryFactory
                .selectFrom(QChargingStation.chargingStation)
                .where(
                        isLimitYn(limitYn),
                        isParkingFree(parkingFree),
                        isZcode(zcode),
                        isZscode(zscode),
                        isPrimary(isPrimary),
                        isBusiId(busiIds),
                        isChgerType(chgerTypes),
                        isKw(kw)
                );

        return PageableExecutionUtils.getPage(results, pageable, () -> countQuery.fetchCount());
    }


    // Helper methods for conditions

    private BooleanExpression isLimitYn(String limitYn) {
        return limitYn.isEmpty() ? null : QChargingStation.chargingStation.limitYn.eq(limitYn);
    }

    private BooleanExpression isParkingFree(String parkingFree) {
        return parkingFree.isEmpty() ? null : QChargingStation.chargingStation.parkingFree.eq(parkingFree);
    }

    private BooleanExpression isZcode(String zcode) {
        return zcode.isEmpty() ? null : QChargingStation.chargingStation.regionDetail.zcode.zcode.eq(zcode);
    }

    private BooleanExpression isZscode(String zscode) {
        return zscode.isEmpty() ? null : QChargingStation.chargingStation.regionDetail.zscode.eq(zscode);
    }

    private BooleanExpression isBusiId(List<String> busiIds) {
        return busiIds.isEmpty() ? null : QChargingStation.chargingStation.operatingCompany.busiId.in(busiIds);
    }

    private BooleanExpression isChgerType(List<String> chgerTypes) {
        return chgerTypes.isEmpty() ? null : QChargingStation.chargingStation.chargers.any().chgerType.in(chgerTypes);
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