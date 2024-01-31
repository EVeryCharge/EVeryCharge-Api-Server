package com.ll.eitcharge.domain.review.review.repository;

import com.ll.eitcharge.domain.review.review.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findFirst10ByOrderByIdDesc();

    List<Review> findByChargingStationStatIdOrderByIdDesc(String chargingStation);

}