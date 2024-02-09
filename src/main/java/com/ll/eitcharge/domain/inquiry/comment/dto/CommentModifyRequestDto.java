package com.ll.eitcharge.domain.inquiry.comment.dto;

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

    public CommentModifyRequestDto(String content, Long commentId) {
        this.content = content;
        this.commentId = commentId;
    }
}
