package com.ll.eitcharge.domain.review.review.controller;

import com.ll.eitcharge.domain.inquiry.comment.dto.CommentResponseDto;
import com.ll.eitcharge.domain.inquiry.inquiry.dto.InquiryRequestDto;
import com.ll.eitcharge.domain.member.member.entity.Member;
import com.ll.eitcharge.domain.member.member.service.MemberService;
import com.ll.eitcharge.domain.review.review.dto.ReviewDto;
import com.ll.eitcharge.domain.review.review.dto.ReviewFileDto;
import com.ll.eitcharge.domain.review.review.entity.Review;
import com.ll.eitcharge.domain.review.review.service.ReviewService;
import com.ll.eitcharge.global.rq.Rq;
import com.ll.eitcharge.global.rsData.RsData;
import jakarta.validation.Valid;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/review")
@RequiredArgsConstructor
public class ReviewController {
    private final ReviewService reviewService;
    private final Rq rq;
    private final MemberService memberService;

    @Getter
    public static class GetLast10ReviewResponseBody {
        private final List<ReviewDto> items;

        public GetLast10ReviewResponseBody(List<Review> reviews) {
            this.items = reviews
                    .stream()
                    .map(ReviewDto::new)
                    .toList();

        }
    }
    @GetMapping("")
    public RsData<GetLast10ReviewResponseBody> getLast10Reviews(){
        return RsData.of(
                "200",
                "성공",
                new GetLast10ReviewResponseBody(reviewService.findFirst10ByOrderByIdDesc()));
    }

    @Getter
    public static class GetStatReviewResponseBody {
        private final List<ReviewDto> items;

        public GetStatReviewResponseBody(List<ReviewDto> reviews) {
            this.items = reviews
                    .stream()
//                    .map(ReviewDto::new)
                    .toList();

        }
    }

//    @GetMapping("/all")
//    public ResponseEntity< List<CommentResponseDto>> findAll(@RequestParam("inquiryId") Long inquiryId){
//        List< CommentResponseDto > responseDtoList = commentService.findAll(inquiryId);
//        return ResponseEntity.status(HttpStatus.OK).body(responseDtoList);
//    }

//    @GetMapping("/{statId}")
//    public ResponseEntity<List<Review>> getStatReviews(@PathVariable String statId){
//        return ResponseEntity.ok(reviewService.findByStatId(statId));
//    }

    @GetMapping("/{statId}")
    public RsData<GetStatReviewResponseBody> getStatReviews(@PathVariable String statId){
        System.out.println("API호출됨");
        return RsData.of(
                "200",
                "성공",
                new GetStatReviewResponseBody(reviewService.findByStatId(statId)));
    }


    @Getter
    @Setter
    public static class WriteReviewRequestBody {
        private String content;
        private int rating;
    }

    @Getter
    public static class WriteReviewResponseBody {
        private final ReviewDto item;

        public WriteReviewResponseBody(Review review) {
            item = new ReviewDto(review);
        }
    }

    @Transactional
    @PreAuthorize("isAuthenticated()")
    @PostMapping("{chargingStationId}")
    public ResponseEntity<ReviewFileDto> writeReview(@RequestPart(value = "files", required = false) List<MultipartFile> files,
                                                       @RequestPart(value = "data") @Valid ReviewFileDto reviewFileDto,
                                                       @PathVariable String chargingStationId
    ) {

        Member member = rq.getMember();
        int rating = reviewFileDto.getRating();

        Review review = reviewService.write(member, chargingStationId, reviewFileDto.getContent(), rating, files).getData();

        return ResponseEntity.ok(reviewFileDto);

    }

//    @Transactional
//    @PreAuthorize("isAuthenticated()")
//    @PostMapping("{chargingStationId}")
//    public RsData<WriteReviewResponseBody> writeReview(
//            @PathVariable String chargingStationId,
//            @RequestBody WriteReviewRequestBody requestBody
//    ) {
//        Member member = rq.getMember();
//        int rating = requestBody.getRating();
//
//        Review review = reviewService.write(member, chargingStationId, requestBody.getContent(), rating).getData();
//
//
//        return RsData.of(
//                "200",
//                "성공",
//                new WriteReviewResponseBody(
//                        review
//                )
//        );
//    }

    @Getter
    @Setter
    public static class ModifyReviewRequestBody {
        private String content;
        private int rating;
    }

    @Getter
    public static class ModifyReviewResponseBody {
        private final ReviewDto item;

        public ModifyReviewResponseBody(Review review) {
            item = new ReviewDto(review);
        }
    }

    @Transactional
    @PreAuthorize("isAuthenticated()")
    @PutMapping("/{chargingStationId}/{id}")
    public RsData<ModifyReviewResponseBody> modifyReview(
            @PathVariable long id,
            @RequestBody ModifyReviewRequestBody requestBody
    ) {
        Review review = reviewService.findById(id).get();

        int rating = requestBody.getRating();
        reviewService.modify(review, requestBody.getContent(), rating);

        return RsData.of(
                "200",
                "성공",
                new ModifyReviewResponseBody(review)
        );
    }

    @Getter
    public static class RemoveReviewResponseBody {
        private final ReviewDto item;

        public RemoveReviewResponseBody(Review review) {
            item = new ReviewDto(review);
        }
    }

    @PreAuthorize("isAuthenticated()")
    @Transactional
    @DeleteMapping("/{chargingStationId}/{id}")
    public RsData<RemoveReviewResponseBody> removeReview(
            @PathVariable long id
    ) {

        reviewService.deleteById(id);

        return RsData.of(
                "200",
                "성공"
        );
    }
}
