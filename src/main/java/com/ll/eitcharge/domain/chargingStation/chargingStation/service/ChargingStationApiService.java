package com.ll.eitcharge.domain.chargingStation.chargingStation.service;

import com.ll.eitcharge.domain.chargingStation.chargingStation.entity.ChargingStation;
import com.ll.eitcharge.domain.chargingStation.chargingStation.repository.ChargingStationRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.hibernate.proxy.EntityNotFoundDelegate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ChargingStationApiService {

    private final ChargingStationRepository chargingStationRepository;

    public ChargingStation findById(Long id) {
        Optional< ChargingStation > oc = chargingStationRepository.findById(id);
        if(oc.isEmpty()){
            new EntityNotFoundException("id가" + id + "인 충전소는 존재하지 않습니다.");
        }
        return oc.get();
    }
}
