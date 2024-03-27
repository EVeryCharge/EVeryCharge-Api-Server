package com.ll.everycharge.domain.inquiry.comment.dto;

import com.ll.everycharge.domain.inquiry.comment.entity.Comment;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class CommentModifyResponseDto {
    @NotNull
    private String content;

    public CommentModifyResponseDto(Comment comment) {
        this.content = comment.getContent();
    }
}
