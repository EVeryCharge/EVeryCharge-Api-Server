package com.ll.eitcharge.domain.review.review.service;

import com.ll.eitcharge.domain.chargingStation.chargingStation.entity.ChargingStation;
import com.ll.eitcharge.domain.chargingStation.chargingStation.service.ChargingStationService;
import com.ll.eitcharge.domain.member.member.entity.Member;
import com.ll.eitcharge.domain.review.review.entity.Review;
import com.ll.eitcharge.domain.review.review.repository.ReviewRepository;
import com.ll.eitcharge.global.rsData.RsData;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

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
    public void modify(Review review,String content) {
        review.setContent(content);
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