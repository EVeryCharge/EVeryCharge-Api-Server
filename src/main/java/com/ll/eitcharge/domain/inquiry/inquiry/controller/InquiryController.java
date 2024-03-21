package com.ll.eitcharge.domain.inquiry.inquiry.controller;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.Bucket;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.ll.eitcharge.domain.base.uploadedfiles.service.UploadedFilesService;
import com.ll.eitcharge.domain.inquiry.inquiry.dto.InquiryDetailResponseDto;
import com.ll.eitcharge.domain.inquiry.inquiry.dto.InquiryRequestDto;
import com.ll.eitcharge.domain.inquiry.inquiry.dto.InquiryResponseDto;
import com.ll.eitcharge.domain.inquiry.inquiry.entity.Inquiry;
import com.ll.eitcharge.domain.inquiry.inquiry.service.InquiryService;
import com.ll.eitcharge.domain.report.report.dto.ReportRequestDto;
import com.ll.eitcharge.domain.report.report.dto.ReportResponseDto;
import com.ll.eitcharge.global.aws.s3.S3Config;
import com.ll.eitcharge.global.exceptions.GlobalException;
import com.ll.eitcharge.global.rsData.RsData;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;


@Slf4j
@RestController
@RequestMapping(value = "/api/v1/inquiry")
@Tag(name = "InquiryController", description = "문의게시판 컨트롤러 API")
@RequiredArgsConstructor
public class InquiryController {
    private final InquiryService inquiryService;

    @GetMapping("/list")
    public ResponseEntity<Page<InquiryResponseDto>> getList(
            @RequestParam(value="page", defaultValue = "0") int page,
            @RequestParam(value="pageSize", defaultValue = "10") int pageSize
    ) {
        inquiryService.updateStatus();
        Page<InquiryResponseDto> inquiryList = inquiryService.getList(page, pageSize);
        return ResponseEntity.ok(inquiryList);
    }

    @PreAuthorize("isAuthenticated()")
    @ResponseBody
    @PostMapping("/create")
    public ResponseEntity<InquiryRequestDto> create(@RequestPart(value = "files", required = false) List<MultipartFile> files,
                                                    @RequestPart(value = "data") @Valid InquiryRequestDto requestDto,
                                                    Principal principal
    ) {
        inquiryService.create(requestDto, files, principal.getName());

        return ResponseEntity.ok(requestDto);
    }

    @GetMapping("/{id}")
    public ResponseEntity<InquiryDetailResponseDto> getInquiry(@PathVariable Long id) {
        InquiryDetailResponseDto inquiry = inquiryService.getInquiryById(id);

        return ResponseEntity.ok(inquiry);
    }

    @PreAuthorize("isAuthenticated()")
    @PutMapping("/{id}")
    public ResponseEntity<InquiryResponseDto> modify(
            @PathVariable Long id,
            @RequestBody InquiryRequestDto inquiryRequestDto,
            Principal principal) {

        return ResponseEntity.ok(inquiryService.modify(id, inquiryRequestDto, principal.getName()));
    }

    @PreAuthorize("isAuthenticated()")
    @DeleteMapping("/{id}")
    public void delete(
            @PathVariable Long id,
            Principal principal) {

        inquiryService.delete(id, principal.getName());
    }
}
