package com.ll.everycharge.domain.review.review.service;


import com.ll.everycharge.domain.base.uploadedfiles.entity.UploadedFiles;
import com.ll.everycharge.domain.base.uploadedfiles.service.UploadedFilesService;
import com.ll.everycharge.domain.chargingStation.chargingStation.service.ChargingStationService;
import com.ll.everycharge.domain.member.member.entity.Member;
import com.ll.everycharge.domain.review.review.dto.ReviewFileDto;
import com.ll.everycharge.domain.review.review.entity.Review;
import com.ll.everycharge.domain.review.review.repository.ReviewRepository;
import com.ll.everycharge.global.rsData.RsData;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

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
    public ReviewFileDto modify(ReviewFileDto reviewFileDto, Long id, List<MultipartFile> files) {

        Review review = findById(id).get();
        review.setContent(reviewFileDto.getContent());
        review.setRating(reviewFileDto.getRating());

        uploadedFilesService.update(files, "Review", id, reviewFileDto.getS3fileUrl());
        List<String> urllist = uploadedFilesService.getUrllist("Review", id);

        return new ReviewFileDto(review, urllist);
    }

//    Inquiry inquiry = inquiryRepository.findById(id)
//            .orElseThrow(() -> new IllegalArgumentException("해당 글이 없습니다. id=" + id));
//
//        if (!inquiry.getWriter().getUsername().equals(username)) {
//        throw new GlobalException("수정권한이 없습니다.");
//    }
//        inquiry.update(inquiryRequestDto);
//        uploadedFilesService.update(files, "Inquiry", id, inquiryRequestDto.getS3fileNames());
//
//        return new InquiryResponseDto(inquiry);

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