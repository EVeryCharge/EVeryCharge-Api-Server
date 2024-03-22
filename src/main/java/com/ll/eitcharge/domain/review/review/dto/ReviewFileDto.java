package com.ll.eitcharge.domain.review.review.dto;

import com.ll.eitcharge.domain.review.review.entity.Review;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

import static lombok.AccessLevel.PROTECTED;

@Getter
@Setter
@NoArgsConstructor(access = PROTECTED)
@AllArgsConstructor(access = PROTECTED)
public class ReviewFileDto {

    private int rating;
    private String content;
    private List<String> s3fileUrl;

    public ReviewFileDto(Review review) {
        this.rating = review.getRating();
        this.content = review.getContent();
    }
}
