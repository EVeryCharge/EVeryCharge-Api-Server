package com.ll.eitcharge.domain.inquiry.comment.dto;

import com.ll.eitcharge.domain.inquiry.comment.entity.Comment;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import static lombok.AccessLevel.PROTECTED;

@NoArgsConstructor(access = PROTECTED)
@Getter
public class CommentResponseDto {
    @NotNull
    private Long commentId;
    @NotNull
    private String writer;
    @NotNull
    private String nickname;
    @NotNull
    private String content;

    private LocalDateTime createDate;

    private LocalDateTime modifiedDate;

    public CommentResponseDto(Comment comment) {
        this.commentId = comment.getId();
        this.writer = comment.getMember().getName();
        this.nickname = comment.getMember().getNickname();
        this.content = comment.getContent();
        this.createDate = comment.getCreatedDate();
        this.modifiedDate = comment.getModifiedDate();
    }
}
