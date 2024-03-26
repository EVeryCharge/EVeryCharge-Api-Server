package com.ll.everycharge.domain.inquiry.inquiry.repository;

import com.ll.everycharge.domain.inquiry.inquiry.entity.Inquiry;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InquiryRepository extends JpaRepository<Inquiry, Long> {

    Page<Inquiry> findAll(Pageable pageable);

}
