package com.ll.eitcharge.domain.inquiry.inquiry.service;

import com.ll.eitcharge.domain.inquiry.inquiry.dto.InquiryRequestDto;
import com.ll.eitcharge.domain.inquiry.inquiry.dto.InquiryResponseDto;
import com.ll.eitcharge.domain.inquiry.inquiry.entity.Inquiry;
import com.ll.eitcharge.domain.inquiry.inquiry.repository.InquiryRepository;
import com.ll.eitcharge.domain.member.member.service.MemberService;
import com.ll.eitcharge.domain.report.report.dto.ReportRequestDto;
import com.ll.eitcharge.domain.report.report.dto.ReportResponseDto;
import com.ll.eitcharge.domain.report.report.entity.Report;
import com.ll.eitcharge.global.exceptions.GlobalException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class InquiryService {
    private final InquiryRepository inquiryRepository;
    private final MemberService memberService;

    public Page<InquiryResponseDto> getList(int page, int pageSize) {
        List<Sort.Order> sorts = new ArrayList<>();
        sorts.add(Sort.Order.desc("createdDate"));
        Pageable pageable = PageRequest.of(page, pageSize, Sort.by(sorts));

        Page<Inquiry> inquiryPage = inquiryRepository.findAll(pageable);

        return inquiryPage.map(InquiryResponseDto::new);
    }

    @Transactional
    public InquiryResponseDto create(InquiryRequestDto requestDto, String username) {
        Inquiry inquiry = Inquiry.builder()
                .content(requestDto.getContent())
                .title(requestDto.getTitle())
                .inquiryType(requestDto.getInquiryType())
                .isPublished(requestDto.getIsPublished())
                .writer(memberService.findByUsername(username).orElseThrow(GlobalException.E404::new))
                .inquiryState("답변대기")
                .build();
        inquiryRepository.save(inquiry);
        return new InquiryResponseDto(inquiry);
    }

    public InquiryResponseDto getInquiryById(Long id) {
        Inquiry inquiry = inquiryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당하는 문의사항이 없습니다. id=" + id));

        return new InquiryResponseDto(inquiry);
    }
}