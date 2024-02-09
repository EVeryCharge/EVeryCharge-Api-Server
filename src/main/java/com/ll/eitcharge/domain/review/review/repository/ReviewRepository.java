package com.ll.eitcharge.domain.review.review.repository;

import com.ll.eitcharge.domain.review.review.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findFirst10ByOrderByIdDesc();

//    List<Review> findByChargingStationStatIdOrderByIdDesc(String chargingStation);

    @Query("SELECT r FROM Review r JOIN FETCH r.chargingStation cs JOIN FETCH r.member m WHERE cs.statId = :statId ORDER BY r.id DESC")
    List<Review> findByChargingStationStatIdOrderByIdDesc(@Param("statId") String statId);

}