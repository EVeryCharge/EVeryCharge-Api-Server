package com.ll.eitcharge.domain.inquiry.inquiry.repository;

import com.ll.eitcharge.domain.member.member.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InquiryRepository extends JpaRepository<Member, Long> {

}
