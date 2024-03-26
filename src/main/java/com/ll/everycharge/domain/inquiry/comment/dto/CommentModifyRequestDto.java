package com.ll.everycharge.domain.inquiry.comment.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class CommentModifyRequestDto {
    @NotNull
    private String content;
    @NotNull
    private Long commentId;
    @NotNull
    private String writer;

    public CommentModifyRequestDto(String content, Long commentId, String writer) {
        this.content = content;
        this.commentId = commentId;
        this.writer = writer;
    }
}
