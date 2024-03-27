package com.ll.everycharge.domain.review.review.repository;

import com.ll.everycharge.domain.review.review.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findFirst10ByOrderByIdDesc();

//    List<Review> findByChargingStationStatIdOrderByIdDesc(String chargingStation);

    @Query("SELECT r FROM Review r JOIN FETCH r.chargingStation cs JOIN FETCH r.member m WHERE cs.statId = :statId ORDER BY r.id DESC")
    List<Review> findByChargingStationStatIdOrderByIdDesc(@Param("statId") String statId);

    @Query("SELECT r.id FROM Review r JOIN r.chargingStation cs WHERE cs.statId = :statId ORDER BY r.id DESC")
    List<Long> findIdsByChargingStationStatId(@Param("statId") String statId);

}