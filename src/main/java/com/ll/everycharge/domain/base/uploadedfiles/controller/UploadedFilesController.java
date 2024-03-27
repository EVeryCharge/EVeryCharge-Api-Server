package com.ll.everycharge.domain.base.uploadedfiles.controller;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.Bucket;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@Controller
@RequestMapping("/UploadedFiles")
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Tag(name = "UploadedFilesController", description = "파일 서비스 기능 제공")
public class UploadedFilesController {
    private final AmazonS3 amazonS3;

    @GetMapping("/")
    public List<String> listBuckets() {
        List<Bucket> buckets = amazonS3.listBuckets();

        return buckets.stream().map(Bucket::getName).collect(Collectors.toList());
    }

//    @PostMapping("/fileupload")
//    @ResponseBody
//    public ResponseEntity<String> uploadFile(@RequestPart("files") List<MultipartFile> files,
//                                             @RequestParam String type) {
//
//        uploadedFilesService.upload(files, s3Config.getBucket(), type);
//        return ResponseEntity.ok("파일 업로드 완료");
//
//    }

}


