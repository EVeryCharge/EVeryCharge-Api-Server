package com.ll.eitcharge.domain.inquiry.inquiry.dto;


import com.ll.eitcharge.domain.inquiry.inquiry.entity.Inquiry;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.lang.NonNull;

import java.util.List;

import static lombok.AccessLevel.PROTECTED;

@Getter
@Setter
@NoArgsConstructor(access = PROTECTED)
@AllArgsConstructor(access = PROTECTED)
public class InquiryDetailResponseDto {
    private String title;
    private String content;
    private String writer;
    private String inquiryType;
    private Boolean isPublished;
    private List<String> s3fileUrl;

    public InquiryDetailResponseDto(Inquiry entity, List<String> url) {
        this.title = entity.getTitle();
        this.content = entity.getContent();
        this.writer = entity.getWriter().getUsername();
        this.inquiryType = entity.getInquiryType();
        this.isPublished = entity.getIsPublished();
        this.s3fileUrl = url;
    }
}
