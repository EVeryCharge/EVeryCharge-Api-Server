package com.ll.everycharge.domain.member.member.dto;

import static lombok.AccessLevel.*;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.validation.constraints.NotNull;
import org.springframework.lang.NonNull;

import com.ll.everycharge.domain.member.member.entity.Member;

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
    @NonNull
    private String nickname;
    @NotNull
    private String profileImgUrl;

    public MemberDto(Member member) {
        this.id = member.getId();
        this.createDate = member.getCreatedDate();
        this.modifyDate = member.getModifiedDate();
        this.username = member.getUsername();
        this.authorities = member.getAuthoritiesAsStringList();
        this.nickname = member.getNickname();
        this.profileImgUrl = member.getProfileImgUrl();
    }
}