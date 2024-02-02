package com.ll.eitcharge.domain.inquiry.inquiry.dto;

import com.ll.eitcharge.domain.inquiry.inquiry.entity.Inquiry;

public class InquiryResponseDto {
    private Long id;
    private String title;
    private String content;
    private String writer;
    private String inquiryState;
    private String inquiryType;
    private int viewCount;

    public InquiryResponseDto(Inquiry entity) {
        this.id = entity.getId();
        this.title = entity.getTitle();
        this.content = entity.getContent();
        this.writer = entity.getWriter();
        this.inquiryState = entity.getInquiryState();
        this.inquiryType = entity.getInquiryType();
        this.viewCount = entity.getViewCount();
    }
}
