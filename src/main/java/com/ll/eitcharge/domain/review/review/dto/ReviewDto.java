package com.ll.eitcharge.domain.review.review.dto;

import com.ll.eitcharge.domain.review.review.entity.Review;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class ReviewDto {
    private final Long id;
    private final Long userId;
    private final String userName;
    private final String chargingStationId;
    private final int rating;
    private final LocalDateTime createDate;
    private final LocalDateTime modifyDate;
    private final LocalDateTime deleteDate;
    private final boolean isDeleted;
    private final String content;


    public ReviewDto(Review review) {
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
    }


}