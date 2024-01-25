package com.ll.eitcharge.domain.member.member.dto;

import static lombok.AccessLevel.*;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.lang.NonNull;

import com.ll.eitcharge.domain.member.member.entity.Member;

import lombok.Getter;
import lombok.NoArgsConstructor;
@NoArgsConstructor(access = PROTECTED)
@Getter
public class MemberDto {
    @NonNull
    private long id;
    @NonNull
    private LocalDateTime createDate;
    @NonNull
    private LocalDateTime modifyDate;
    @NonNull
    private String username;
    @NonNull
    private List<String> authorities;

    public MemberDto(Member member) {
        this.id = member.getId();
        this.createDate = member.getCreatedDate();
        this.modifyDate = member.getModifiedDate();
        this.username = member.getUsername();
        this.authorities = member.getAuthoritiesAsStringList();
    }
}