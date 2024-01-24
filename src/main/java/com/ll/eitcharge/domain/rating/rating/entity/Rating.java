package com.ll.eitcharge.domain.rating.rating.entity;

import com.ll.eitcharge.domain.comment.comment.entity.Comment;
import jakarta.persistence.*;
import lombok.*;

import static jakarta.persistence.FetchType.*;
import static lombok.AccessLevel.PROTECTED;

@Entity
@NoArgsConstructor(access = PROTECTED)
@AllArgsConstructor(access = PROTECTED)
@Builder
@Getter
@Setter
public class Rating {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = LAZY)
    private Comment comment;

    private int rating;
}
