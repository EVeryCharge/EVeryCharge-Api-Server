package com.ll.eitcharge.domain.member.member.entity;

import static jakarta.persistence.FetchType.*;
import static lombok.AccessLevel.*;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import com.ll.eitcharge.domain.technicalManager.technicalManager.entity.TechnicalManager;
import com.ll.eitcharge.global.jpa.entity.BaseTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Transient;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@NoArgsConstructor(access = PROTECTED)
@AllArgsConstructor(access = PROTECTED)
@Builder
@Getter
@Setter
public class Member extends BaseTime {
    @OneToOne(fetch = LAZY, mappedBy = "member")
    private TechnicalManager technicalManager;

    @Column(unique = true)
    private String username;
    private String password;
    @Column(unique = true)
    private String refreshToken;
    // 캐시 데이터
    @Transient
    private Boolean _isAdmin;



    @Transient
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return getAuthoritiesAsStringList()
                .stream()
                .map(SimpleGrantedAuthority::new)
                .toList();
    }

    @Transient
    public List<String> getAuthoritiesAsStringList() {
        List<String> authorities = new ArrayList<>();

        authorities.add("ROLE_MEMBER");

        if (isAdmin())
            authorities.add("ROLE_ADMIN");

        return authorities;
    }

    @Transient
    public String getName() {
        return username;
    }

    @Transient
    public boolean isAdmin() {
        if (this._isAdmin != null)
            return this._isAdmin;

        this._isAdmin = List.of("system", "admin").contains(getUsername());

        return this._isAdmin;
    }

    // List.of("system", "admin").contains(getUsername()); 이걸할 때 findById 가 실행될 수 도 있는데
    // 이 함수를 통해서 _isAdmin 필드의 값을 강제로 정하면서, 적어도 isAdmin() 함수 때문에 findById 가 실행되지 않도록 한다.
    @Transient
    public void setAdmin(boolean admin) {
        this._isAdmin = admin;
    }
}