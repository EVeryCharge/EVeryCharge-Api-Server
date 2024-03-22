package com.ll.eitcharge.domain.base.uploadedfiles.controller;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.Bucket;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.ll.eitcharge.domain.base.uploadedfiles.entity.UploadedFiles;
import com.ll.eitcharge.domain.base.uploadedfiles.service.UploadedFilesService;
import com.ll.eitcharge.global.aws.s3.S3Config;
import com.ll.eitcharge.global.exceptions.GlobalException;
import com.ll.eitcharge.standard.util.Ut;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.util.List;
import java.util.stream.Collectors;

@Controller
@RequestMapping("/UploadedFiles")
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Tag(name = "UploadedFilesController", description = "파일 다운로드 등 다양한 기능 제공")
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

//    @GetMapping("/download/{fileName}")
//    @Operation(summary = "파일 다운로드")
//    public ResponseEntity<Resource> download(
//            @PathVariable String fileName, HttpServletRequest request
//    ) throws FileNotFoundException {
//        UploadedFiles UploadedFiles = UploadedFilesService.findByFileName(fileName).orElseThrow(
//                GlobalException.E404::new
//        );
//        String filePath = UploadedFiles.getFilePath();
//
//        Resource resource = new InputStreamResource(new FileInputStream(filePath));
//
//        String contentType = request.getServletContext().getMimeType(new File(filePath).getAbsolutePath());
//
//        if (contentType == null) contentType = "application/octet-stream";
//
//        String downloadFileName = Ut.url.encode(UploadedFiles.getOriginFileName()).replace("%20", " ");
//
//        return ResponseEntity.ok()
//                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + downloadFileName + "\"")
//                .contentType(MediaType.parseMediaType(contentType)).body(resource);
//    }
}


