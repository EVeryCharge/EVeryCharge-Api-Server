package com.ll.eitcharge.domain.inquiry.inquiry.dto;

import lombok.*;

import static lombok.AccessLevel.PROTECTED;

@Getter
@Setter
@Builder
@NoArgsConstructor(access = PROTECTED)
@AllArgsConstructor(access = PROTECTED)
public class InquiryRequestDto {
    private String title;
    private String content;
    private String writer;
    private String inquiryType;
    private boolean isPublished;

}
