package com.ll.eitcharge.domain.member.member.controller;

import com.ll.eitcharge.domain.member.member.dto.MemberDto;
import com.ll.eitcharge.domain.member.member.entity.Member;
import com.ll.eitcharge.domain.member.member.service.MemberService;
import com.ll.eitcharge.global.exceptions.GlobalException;
import com.ll.eitcharge.global.rq.Rq;
import com.ll.eitcharge.global.rsData.RsData;
import com.ll.eitcharge.standard.base.Empty;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/v1/members")
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MemberController {
    private final MemberService memberService;
    private final Rq rq;

    public record LoginRequestBody(@NotBlank String username, @NotBlank String password) {
    }

    public record LoginResponseBody(@NonNull MemberDto item) {
    }

    public record SignupRequestBody(@NotBlank String username, @NotBlank String password1, @NotBlank String password2) {
    }

    @PostMapping("/login")
    public RsData<LoginResponseBody> login(@Valid @RequestBody LoginRequestBody body) {
        RsData<MemberService.AuthAndMakeTokensResponseBody> authAndMakeTokensRs = memberService.authAndMakeTokens(
                body.username,
                body.password
        );

        rq.setCrossDomainCookie("refreshToken", authAndMakeTokensRs.getData().refreshToken());
        rq.setCrossDomainCookie("accessToken", authAndMakeTokensRs.getData().accessToken());

        return authAndMakeTokensRs.newDataOf(
                new LoginResponseBody(
                        new MemberDto(authAndMakeTokensRs.getData().member())
                )
        );
    }

    public record MeResponseBody(@NonNull MemberDto item) {
    }

    @GetMapping("/me")
    public RsData<MeResponseBody> getMe() {
        return RsData.of(
                new MeResponseBody(
                        new MemberDto(rq.getMember())
                )
        );
    }

    @PostMapping("/logout")
    public RsData<Empty> logout() {
        rq.setLogout();

        return RsData.of("로그아웃 성공");
    }

    @PostMapping("/signup")
    public RsData<Member> signup(@Valid @RequestBody SignupRequestBody body) {
        if(!body.password1.equals(body.password2))
            throw new GlobalException("400-1", "두개의 비밀번호가 일치하지 않습니다.");

        if (memberService.findByUsername(body.username).isPresent())
            throw new GlobalException("400-2", "이미 존재하는 회원입니다.");

        return memberService.join(body.username, body.password1);
    }

    @GetMapping("/checkid/{username}")
    public boolean checkid(@PathVariable String username){
        if (memberService.findByUsername(username).isPresent()) {
            return false;
        } else {
            return true;
        }
    }
}
