package com.ll.eitcharge.domain.inquiry.inquiry.dto;

import lombok.*;
import org.springframework.lang.NonNull;

import java.util.ArrayList;
import java.util.List;

import static lombok.AccessLevel.PROTECTED;

@Getter
@Setter
@Builder
@NoArgsConstructor(access = PROTECTED)
@AllArgsConstructor(access = PROTECTED)
public class InquiryRequestDto {
    @NonNull
    private String title;
    @NonNull
    private String content;
    private String writer;
    @NonNull
    private String inquiryType;
    private Boolean isPublished;
    private List<String> s3fileNames = new ArrayList<>();

}
