package com.ll.everycharge.domain.member.member.controller;

import com.ll.everycharge.global.rq.Rq;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Controller
@RequiredArgsConstructor
public class SocialMemberController {
    private final Rq rq;

    @GetMapping("/socialLogin/{providerTypeCode}")
    public String socialLogin(String redirectUrl, @PathVariable String providerTypeCode) {
        if (rq.isFrontUrl(redirectUrl)) {
            rq.setCookie("redirectUrlAfterSocialLogin", redirectUrl, 60 * 10);
        }

        return "redirect:/oauth2/authorization/" + providerTypeCode;
    }

    @GetMapping("/")
    public String main(){
        String redirectUrlAfterSocialLogin = rq.getCookie("redirectUrlAfterSocialLogin").getValue();

        return "redirect:"+ redirectUrlAfterSocialLogin;
    }


}
