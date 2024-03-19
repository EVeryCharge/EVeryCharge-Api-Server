package com.ll.eitcharge.domain.member.member.controller;

import com.ll.eitcharge.domain.member.member.dto.MemberCarDto;
import com.ll.eitcharge.domain.member.member.dto.MemberDto;
import com.ll.eitcharge.domain.member.member.entity.Member;
import com.ll.eitcharge.domain.member.member.service.MemberService;
import com.ll.eitcharge.domain.mypage.car.dto.CarListDto;
import com.ll.eitcharge.domain.review.review.controller.ReviewController;
import com.ll.eitcharge.domain.review.review.dto.ReviewDto;
import com.ll.eitcharge.domain.review.review.entity.Review;
import com.ll.eitcharge.global.exceptions.GlobalException;
import com.ll.eitcharge.global.rq.Rq;
import com.ll.eitcharge.global.rsData.RsData;
import com.ll.eitcharge.standard.base.Empty;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/v1/members")
@RequiredArgsConstructor
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

        RsData< LoginResponseBody > loginResponseBodyRsData = authAndMakeTokensRs.newDataOf(
                new LoginResponseBody(
                        new MemberDto(authAndMakeTokensRs.getData().member())
                )
        );
        return authAndMakeTokensRs.newDataOf(
                new LoginResponseBody(
                        new MemberDto(authAndMakeTokensRs.getData().member())
                )
        );
    }

    public record MeResponseBody(@NonNull MemberCarDto item) {
    }

    @Transactional(readOnly = true)
    @GetMapping("/me")
    public RsData<MeResponseBody> getMe() {
        return RsData.of(
                new MeResponseBody(
                        new MemberCarDto(rq.getMember())
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

    /////

    @Getter
    @Setter
    public static class CarInitRequestBody {
        private String username;
        private String carModel;
    }

    @Getter
    public static class CarInitResponseBody {
        private final MemberCarDto item;

        public CarInitResponseBody(Member member) {
            item = new MemberCarDto(member);
        }
    }
    @Transactional
    @PutMapping("/carInit")
    public ResponseEntity<CarInitResponseBody> carInit(
            @RequestBody CarInitRequestBody requestBody
    ){

        Member member = memberService.findByUsername(requestBody.username).get();
        memberService.carInit(member, requestBody.carModel);

        return ResponseEntity.ok(new CarInitResponseBody(member));
    }

    @GetMapping("/userInfo")
    public ResponseEntity<MemberCarDto> getUserInfo(
            @RequestParam(value = "username") String username
    ) {
        return ResponseEntity.ok(memberService.getUserInfo(username));
    }

    public record EditResponseBody(@NonNull MemberDto item) {
    }
    public record EditRequestBody(@NotBlank String username, @NotBlank String password, String nickname, String newPassword) {
    }
    @PutMapping("/edit")
    public ResponseEntity<EditResponseBody> edit(@Valid @RequestBody EditRequestBody body){

        Member member = memberService.authAndEdit(body.username, body.password, body.newPassword, body.nickname);
        return ResponseEntity.ok(new EditResponseBody(new MemberDto(member)));
    }
}
