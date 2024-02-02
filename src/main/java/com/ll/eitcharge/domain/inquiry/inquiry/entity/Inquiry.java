package com.ll.eitcharge.domain.inquiry.inquiry.entity;

import com.ll.eitcharge.global.jpa.entity.BaseTime;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import static lombok.AccessLevel.PROTECTED;

@Entity
@NoArgsConstructor(access = PROTECTED)
@AllArgsConstructor(access = PROTECTED)
@Builder(toBuilder = true)
@Getter
public class Inquiry extends BaseTime {

    private String title;
    private String content;
    private String writer;
    private String inquiryState;
    private String inquiryType;
    private int viewCount;
    private boolean isPublished;
}
