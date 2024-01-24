package com.ll.eitcharge.domain.comment.comment.entity;

import com.ll.eitcharge.domain.member.member.entity.Member;
import com.ll.eitcharge.domain.station.station.entity.Station;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

import static jakarta.persistence.FetchType.*;
import static lombok.AccessLevel.PROTECTED;

@Entity
@NoArgsConstructor(access = PROTECTED)
@AllArgsConstructor(access = PROTECTED)
@Builder
@Getter
@Setter
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = LAZY)
    private Station station;

    @ManyToOne(fetch = LAZY)
    private Member member;

    private String content;
    private int statId;
    private LocalDateTime createDate;
    private LocalDateTime modifiedDate;
    private LocalDateTime deletedDate;
    private boolean isDeleted;

}
