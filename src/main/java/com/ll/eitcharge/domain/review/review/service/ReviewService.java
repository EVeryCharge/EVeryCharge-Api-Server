package com.ll.eitcharge.domain.review.review.service;

import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import com.amazonaws.services.s3.transfer.Upload;
import com.ll.eitcharge.domain.base.uploadedfiles.entity.UploadedFiles;
import com.ll.eitcharge.domain.base.uploadedfiles.service.UploadedFilesService;
import com.ll.eitcharge.domain.inquiry.inquiry.dto.InquiryResponseDto;
import com.ll.eitcharge.domain.inquiry.inquiry.entity.Inquiry;
import com.ll.eitcharge.domain.review.review.dto.ReviewDto;
import com.ll.eitcharge.domain.review.review.dto.ReviewFileDto;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ll.eitcharge.domain.chargingStation.chargingStation.service.ChargingStationService;
import com.ll.eitcharge.domain.member.member.entity.Member;
import com.ll.eitcharge.domain.review.review.entity.Review;
import com.ll.eitcharge.domain.review.review.repository.ReviewRepository;
import com.ll.eitcharge.global.rsData.RsData;

import lombok.RequiredArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class ReviewService {
    private final ReviewRepository reviewRepository;
    private final ChargingStationService chargingStationService;
    private final UploadedFilesService uploadedFilesService;

    @Transactional
    public RsData<Review> write(Member member, String chargingStationId, String content, int rating, List<MultipartFile> files) {

        Review review = Review.builder()
                .chargingStation(chargingStationService.findById(chargingStationId))
                .member(member)
                .content(content)
                .rating(rating)
                .build();

        Review savedReview =  reviewRepository.saveAndFlush(review);

        Long relId = savedReview.getId();
        uploadedFilesService.upload(files, "Review", relId);

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
        Review review = findById(id).get();

        List<UploadedFiles> files = uploadedFilesService.findByRel(review);

        uploadedFilesService.delete(files);
        reviewRepository.deleteById(id);
    }


    public List<Review> findFirst10ByOrderByIdDesc() {
        return reviewRepository.findFirst10ByOrderByIdDesc();
    }

    public List<ReviewFileDto> findByStatId(String statId) {

        List<Review> list = reviewRepository.findByChargingStationStatIdOrderByIdDesc(statId);
        List<ReviewFileDto> reviewFileDtos = new ArrayList<>();

        for(Review review : list) {

            List<UploadedFiles> files = uploadedFilesService.findByRel(review);
            List<String> urllist = new ArrayList<>();

            for (UploadedFiles file : files)
                urllist.add(file.getFileUrl());

            ReviewFileDto reviewFileDto = new ReviewFileDto(review, urllist);

            reviewFileDtos.add(reviewFileDto);
        }
        return reviewFileDtos;
    }

    public List<String> getallurl(String statId){
        List<Long> idlist = reviewRepository.findIdsByChargingStationStatId(statId);

        List<String> urllist = new ArrayList<>();
        for(Long relId : idlist){
            List<String> list = uploadedFilesService.getUrllist("Review", relId);
            urllist.addAll(list);
        }

        return urllist;
    }
}
