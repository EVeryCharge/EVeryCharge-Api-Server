package com.ll.everycharge.domain.member.member.service;

import com.ll.everycharge.domain.member.member.dto.MemberCarDto;
import com.ll.everycharge.domain.member.member.entity.Member;
import com.ll.everycharge.domain.member.member.repository.MemberRepository;
import com.ll.everycharge.global.exceptions.GlobalException;
import com.ll.everycharge.global.rsData.RsData;
import com.ll.everycharge.global.security.SecurityUser;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MemberService {
    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthTokenService authTokenService;

    @Transactional
    public RsData<Member> join(String username, String password) {
        Member member = Member.builder()
                .nickname(username)
                .username(username)
                .password(passwordEncoder.encode(password))
                .refreshToken(authTokenService.genRefreshToken())
                .build();
        memberRepository.save(member);

        return RsData.of("%s님 환영합니다. 회원가입이 완료되었습니다. 로그인 후 이용해주세요.".formatted(member.getUsername()), member);
    }

    @Transactional
    public RsData<Member> join(String username, String password, String nickname, String profileImgUrl) {
        Member member = Member.builder()
                .username(username)
                .password(passwordEncoder.encode(password))
                .refreshToken(authTokenService.genRefreshToken())
                .nickname(nickname)
                .profileImgUrl(profileImgUrl)
                .build();
        memberRepository.save(member);

        return RsData.of("%s님 환영합니다. 회원가입이 완료되었습니다. 로그인 후 이용해주세요.".formatted(member.getUsername()), member);
    }

    @Transactional
    public RsData<Member> modifyOrJoin(String username, String providerTypeCode, String nickname, String profileImgUrl) {
        Member member = findByUsername(username).orElse(null);
        if (member == null) {
            return join(username, "", nickname, profileImgUrl);
        }
        return modifyNicknameAndProfile(member, nickname, profileImgUrl);
    }

    @Transactional
    public RsData<Member> modifyNicknameAndProfile(Member member, String nickname, String profileImgUrl) {
        member.changeNickNameAndProfileImgUrl(nickname, profileImgUrl);
        return RsData.of("200", "ok", member);
    }

    public Optional<Member> findByUsername(String username) {
        return memberRepository.findByUsername(username);
    }

    public long count() {
        return memberRepository.count();
    }

    public RsData<Member> whenSocialLogin(String providerTypeCode, String username, String nickname, String profileImgUrl) {
        Optional<Member> opMember = findByUsername(username);

        if (opMember.isPresent()) return RsData.of("이미 존재합니다.", opMember.get());

        return join(username, "");
    }


    public record AuthAndMakeTokensResponseBody(
            @NonNull Member member,
            @NonNull String accessToken,
            @NonNull String refreshToken
    ) {
    }

    @Transactional
    public RsData<AuthAndMakeTokensResponseBody> authAndMakeTokens(String username, String password) {
        Member member = findByUsername(username)
                .orElseThrow(() -> new GlobalException("400-1", "해당 유저가 존재하지 않습니다."));

        if (!passwordMatches(member, password))
            throw new GlobalException("400-2", "비밀번호가 일치하지 않습니다.");

        String refreshToken = member.getRefreshToken();
        String accessToken = authTokenService.genAccessToken(member);

        return RsData.of(
                "%s님 안녕하세요.".formatted(member.getUsername()),
                new AuthAndMakeTokensResponseBody(member, accessToken, refreshToken)
        );
    }

    @Transactional
    public String genAccessToken(Member member) {
        return authTokenService.genAccessToken(member);
    }

    public boolean passwordMatches(Member member, String password) {
        return passwordEncoder.matches(password, member.getPassword());
    }

    public SecurityUser getUserFromAccessToken(String accessToken) {
        Map<String, Object> payloadBody = authTokenService.getDataFrom(accessToken);

        long id = (int) payloadBody.get("id");
        String username = (String) payloadBody.get("username");
        List<String> authorities = (List<String>) payloadBody.get("authorities");

        return new SecurityUser(
                id,
                username,
                "",
                authorities.stream().map(SimpleGrantedAuthority::new).toList()
        );
    }

    public boolean validateToken(String token) {
        return authTokenService.validateToken(token);
    }

    public RsData<String> refreshAccessToken(String refreshToken) {
        Member member = memberRepository.findByRefreshToken(refreshToken).orElseThrow(() -> new GlobalException("400-1", "존재하지 않는 리프레시 토큰입니다."));

        String accessToken = authTokenService.genAccessToken(member);

        return RsData.of("200-1", "토큰 갱신 성공", accessToken);
    }

    @Transactional
    public void carInit(Member member, String carModel) {
        member.carInit(carModel);
    }

    @Transactional
    public void carDelete(Member member) {
        member.carInit(null);
    }


    public MemberCarDto getUserInfo(String username) {
        return new MemberCarDto(memberRepository.findByUsername(username).get());
    }

    @Transactional
    public Member authAndEdit(String username, String password, String newPassword, String nickname) {
        Member member = findByUsername(username)
                .orElseThrow(() -> new GlobalException("400-1", "해당 유저가 존재하지 않습니다."));

        if (!passwordMatches(member, password))
            throw new GlobalException("400-2", "비밀번호가 일치하지 않습니다.");

        if (nickname.isEmpty()) nickname = member.getNickname();
        if (newPassword.isEmpty()) newPassword = password;
        member.changeUserInfo(nickname, passwordEncoder.encode(newPassword));

        return member;
    }
}
