package com.ll.everycharge.domain.inquiry.comment.dto;


import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class CommentRequestDto {
    @NotNull
    private Long inquiryId;

    @NotNull
    private String content;

    @NotNull
    private Long memberId;

    private Long commentId;


    public CommentRequestDto(Long inquiryId, String content, Long memberId) {
        this.inquiryId = inquiryId;
        this.content = content;
        this.memberId = memberId;
    }

    public CommentRequestDto(Long inquiryId, String content, Long memberId, Long commentId) {
        this.inquiryId = inquiryId;
        this.content = content;
        this.memberId = memberId;
        this.commentId = commentId;
    }
}
