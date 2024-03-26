package com.ll.everycharge.domain.review.review.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ll.everycharge.domain.chargingStation.chargingStation.service.ChargingStationService;
import com.ll.everycharge.domain.member.member.entity.Member;
import com.ll.everycharge.domain.review.review.entity.Review;
import com.ll.everycharge.domain.review.review.repository.ReviewRepository;
import com.ll.everycharge.global.rsData.RsData;

import lombok.RequiredArgsConstructor;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class ReviewService {
    private final ReviewRepository reviewRepository;
    private final ChargingStationService chargingStationService;

    @Transactional
    public RsData<Review> write(Member member, String chargingStationId, String content, int rating) {

        Review review = Review.builder()
                .chargingStation(chargingStationService.findById(chargingStationId))
                .member(member)
                .content(content)
                .rating(rating)
                .build();

        reviewRepository.save(review);

        return RsData.of("200", "%d번 후기가 작성되었습니다.".formatted(review.getId()), review);
    }



    public Optional<Review> findById(long id) {
        return reviewRepository.findById(id);
    }

    @Transactional
    public void modify(Review review,String content, int rating) {
        review.setContent(content);
        review.setRating(rating);
    }

    public List<Review> findAll() {
        return reviewRepository.findAll();
    }

    @Transactional
    public void deleteById(long id) {
        reviewRepository.deleteById(id);
    }


    public List<Review> findFirst10ByOrderByIdDesc() {
        return reviewRepository.findFirst10ByOrderByIdDesc();
    }


    public List<Review> findByStatId(String statId) {
        return reviewRepository.findByChargingStationStatIdOrderByIdDesc(statId);
    }

}