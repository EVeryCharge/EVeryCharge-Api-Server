package com.ll.eitcharge.domain.inquiry.inquiry.service;

import com.ll.eitcharge.domain.inquiry.inquiry.dto.InquiryResponseDto;
import com.ll.eitcharge.domain.inquiry.inquiry.entity.Inquiry;
import com.ll.eitcharge.domain.inquiry.inquiry.repository.InquiryRepository;
import com.ll.eitcharge.domain.report.report.dto.ReportResponseDto;
import com.ll.eitcharge.domain.report.report.entity.Report;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class InquiryService {
    private final InquiryRepository inquiryRepository;

    public Page<InquiryResponseDto> getList(int page, int pageSize){
        List<Sort.Order> sorts = new ArrayList<>();
        sorts.add(Sort.Order.desc("createDate"));
        Pageable pageable = PageRequest.of(page, pageSize, Sort.by(sorts));

        Page<Inquiry> inquiryPage = inquiryRepository.findAll(pageable);

        return inquiryPage.map(InquiryResponseDto::new);
    }
}
