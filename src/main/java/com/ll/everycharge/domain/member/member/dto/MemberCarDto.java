package com.ll.everycharge.domain.member.member.dto;

import com.ll.everycharge.domain.member.member.entity.Member;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.lang.NonNull;

import java.time.LocalDateTime;
import java.util.List;

import static lombok.AccessLevel.PROTECTED;

@NoArgsConstructor(access = PROTECTED)
@Getter
public class MemberCarDto {
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
    private String carModel;

    public MemberCarDto(Member member) {
        this.id = member.getId();
        this.createDate = member.getCreatedDate();
        this.modifyDate = member.getModifiedDate();
        this.username = member.getUsername();
        this.authorities = member.getAuthoritiesAsStringList();
        this.nickname = member.getNickname();
        this.profileImgUrl = member.getProfileImgUrl();
        this.carModel = member.getCarModel();
    }
}