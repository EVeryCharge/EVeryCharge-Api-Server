package com.ll.eitcharge.domain.inquiry.inquiry.service;

import com.ll.eitcharge.domain.base.uploadedfiles.entity.UploadedFiles;
import com.ll.eitcharge.domain.base.uploadedfiles.service.UploadedFilesService;
import com.ll.eitcharge.domain.inquiry.inquiry.dto.InquiryDetailResponseDto;
import com.ll.eitcharge.domain.inquiry.inquiry.dto.InquiryRequestDto;
import com.ll.eitcharge.domain.inquiry.inquiry.dto.InquiryResponseDto;
import com.ll.eitcharge.domain.inquiry.inquiry.entity.Inquiry;
import com.ll.eitcharge.domain.inquiry.inquiry.repository.InquiryRepository;
import com.ll.eitcharge.domain.member.member.service.MemberService;
import com.ll.eitcharge.domain.report.report.dto.ReportRequestDto;
import com.ll.eitcharge.domain.report.report.dto.ReportResponseDto;
import com.ll.eitcharge.domain.report.report.entity.Report;
import com.ll.eitcharge.global.aws.s3.S3Config;
import com.ll.eitcharge.global.exceptions.GlobalException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.awt.desktop.SystemEventListener;
import java.util.ArrayList;
import java.util.List;


@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class InquiryService {
    private final InquiryRepository inquiryRepository;
    private final MemberService memberService;
    private final UploadedFilesService uploadedFilesService;
    private final S3Config s3Config;

    public Page<InquiryResponseDto> getList(int page, int pageSize) {
        List<Sort.Order> sorts = new ArrayList<>();
        sorts.add(Sort.Order.desc("createdDate"));
        Pageable pageable = PageRequest.of(page, pageSize, Sort.by(sorts));

        Page<Inquiry> inquiryPage = inquiryRepository.findAll(pageable);

        return inquiryPage.map(InquiryResponseDto::new);
    }

    @Transactional
    public InquiryResponseDto create(InquiryRequestDto requestDto, List<MultipartFile> files, String username) {
        Inquiry inquiry = Inquiry.builder()
                .content(requestDto.getContent())
                .title(requestDto.getTitle())
                .inquiryType(requestDto.getInquiryType())
                .isPublished(requestDto.getIsPublished())
                .writer(memberService.findByUsername(username).orElseThrow(GlobalException.E404::new))
                .inquiryState("답변대기")
                .build();
        Inquiry savedInquiry = inquiryRepository.saveAndFlush(inquiry);

        Long relId = savedInquiry.getId();
        uploadedFilesService.upload(files, "Inquiry", relId);

        return new InquiryResponseDto(inquiry);
    }

    @Transactional
    public InquiryDetailResponseDto getInquiryById(Long id) {
        Inquiry inquiry = inquiryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당하는 문의사항이 없습니다. id=" + id));

        inquiry.increaseViewCount();



        List<UploadedFiles> files = uploadedFilesService.findByRel(inquiry);
        List<String> urllist = new ArrayList<>();

        for(UploadedFiles file : files)
            urllist.add(file.getFileUrl());

//        inquiry.updateUrl(urllist);

        return new InquiryDetailResponseDto(inquiry, urllist);
    }

    @Transactional
    public InquiryResponseDto modify(Long id, InquiryRequestDto inquiryRequestDto, String username) {
        Inquiry inquiry = inquiryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 글이 없습니다. id=" + id));

        if (!inquiry.getWriter().getUsername().equals(username)) {
            throw new GlobalException("수정권한이 없습니다.");
        }
        inquiry.update(inquiryRequestDto);

        return new InquiryResponseDto(inquiry);
    }

    @Transactional
    public void delete(Long id, String username){
        Inquiry inquiry = inquiryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 글이 없습니다. id=" + id));

        if (!inquiry.getWriter().getUsername().equals(username)) {
            throw new GlobalException("삭제권한이 없습니다.");
        }

        List<UploadedFiles> files = uploadedFilesService.findByRel(inquiry);

        inquiryRepository.delete(inquiry);
        uploadedFilesService.delete(files);
    }

    @Transactional
    public void updateStatus(){
        List< Inquiry > all = inquiryRepository.findAll();
        for (int i = 0; i < all.size(); i++) {
            Inquiry inquiry = all.get(i);
            if(!inquiry.getComments().isEmpty()) inquiry.updateComplete();
        }
    }
}