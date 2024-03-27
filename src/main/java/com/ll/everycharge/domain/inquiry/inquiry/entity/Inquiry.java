package com.ll.everycharge.domain.inquiry.inquiry.entity;


import com.ll.everycharge.domain.inquiry.comment.entity.Comment;
import com.ll.everycharge.domain.inquiry.inquiry.dto.InquiryRequestDto;
import com.ll.everycharge.domain.member.member.entity.Member;
import com.ll.everycharge.global.jpa.entity.BaseTime;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

import static lombok.AccessLevel.PROTECTED;

@Entity
@NoArgsConstructor(access = PROTECTED)
@AllArgsConstructor(access = PROTECTED)
@Builder(toBuilder = true)
@Getter
public class Inquiry extends BaseTime {

    private String title;
    private String content;
    @ManyToOne
    private Member writer;
    private String inquiryState;
    private String inquiryType;
    private int viewCount;
    private Boolean isPublished;
    @OneToMany(mappedBy = "inquiry", cascade = CascadeType.ALL)
    private List<Comment> comments;

    public void update(InquiryRequestDto inquiryRequestDto) {
        this.title = inquiryRequestDto.getTitle();
        this.content = inquiryRequestDto.getContent();
        this.inquiryType = inquiryRequestDto.getInquiryType();
        this.isPublished = inquiryRequestDto.getIsPublished();
    }

    public void increaseViewCount(){
        this.viewCount +=1;
    }

    public void updateComplete() {
        this.inquiryState = "답변완료";
    }
}
