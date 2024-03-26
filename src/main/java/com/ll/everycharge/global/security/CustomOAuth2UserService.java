package com.ll.everycharge.global.security;

import com.ll.everycharge.domain.member.member.entity.Member;
import com.ll.everycharge.domain.member.member.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {
    private final MemberService memberService;

    @Override
    @Transactional
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        String oauthId = oAuth2User.getName();
        String providerTypeCode = userRequest.getClientRegistration().getRegistrationId().toUpperCase();

        Map<String, Object> attributes = oAuth2User.getAttributes();
        Map attributesProperties = (Map) attributes.get("properties");

        String nickname = (String) attributesProperties.get("nickname");
        String profileImgUrl = (String) attributesProperties.get("profile_image");
        String username = providerTypeCode + "__%s".formatted(oauthId);
        Member member = memberService.modifyOrJoin(username, providerTypeCode, nickname, profileImgUrl).getData();

        return new SecurityUser(member.getId(), member.getUsername(), member.getPassword(), member.getAuthorities());
    }
}
