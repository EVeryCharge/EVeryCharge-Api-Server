package com.ll.everycharge.domain.review.review.dto;

import com.ll.everycharge.domain.review.review.entity.Review;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;
import static lombok.AccessLevel.PROTECTED;

@Getter
@Setter
@NoArgsConstructor(access = PROTECTED)
@AllArgsConstructor(access = PROTECTED)
public class ReviewFileDto {

    private Long id;
    private Long userId;
    private String userName;
    private String chargingStationId;
    private int rating;
    private LocalDateTime createDate;
    private LocalDateTime modifyDate;
    private LocalDateTime deleteDate;
    private boolean isDeleted;
    private String content;
    private List<String> s3fileUrl;

    public ReviewFileDto(Review review, List<String> url) {
        this.id = review.getId();
        this.userId = review.getMember().getId();
        this.userName = review.getMember().getUsername();
        this.chargingStationId = review.getChargingStation().getStatId();
        this.rating = review.getRating();
        this.createDate = review.getCreatedDate();
        this.modifyDate = review.getModifiedDate();
        this.deleteDate = review.getDeletedDate();
        this.isDeleted = review.isDeleted();
        this.content = review.getContent();
        this.s3fileUrl = url;
    }
}