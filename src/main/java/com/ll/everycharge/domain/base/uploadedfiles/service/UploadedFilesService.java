package com.ll.everycharge.domain.base.uploadedfiles.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.DeleteObjectRequest;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.ll.everycharge.domain.base.uploadedfiles.entity.UploadedFiles;
import com.ll.everycharge.domain.base.uploadedfiles.repository.UploadedFilesRepository;
import com.ll.everycharge.global.aws.s3.S3Config;
import com.ll.everycharge.global.jpa.entity.BaseEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class UploadedFilesService {
    private final UploadedFilesRepository uploadedFilesRepository;
    private final AmazonS3 amazonS3;
    private final S3Config s3Config;

    @Transactional
    public void upload(List<MultipartFile> files, String relType, Long id){
        if (files == null)
            return;

        try {
            for (MultipartFile file : files) {
                String originalFileName = file.getOriginalFilename();
                String fileExt = originalFileName.substring(originalFileName.lastIndexOf(".") + 1);
                String fileName = UUID.randomUUID() + "." + fileExt;
                String fileDir  = relType + "/" + fileName;
                String fileurl = "https://" + s3Config.getBucket() + ".s3." + s3Config.getRegion() + ".amazonaws.com/" + relType + "/" + fileName;


                ObjectMetadata metadata = new ObjectMetadata();
                metadata.setContentType(file.getContentType());
                metadata.setContentLength(file.getSize());
                amazonS3.putObject(s3Config.getBucket(), fileDir, file.getInputStream(), metadata);

                UploadedFiles uploadedFiles = UploadedFiles.builder()
                        .fileName(fileName)
                        .relTypeCode(relType)
                        .relId(id)
                        .fileSize(file.getSize())
                        .fileExt(fileExt)
                        .fileDir(fileDir)
                        .originFileName(file.getOriginalFilename())
                        .fileUrl(fileurl)
                        .build();
                uploadedFilesRepository.save(uploadedFiles);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public List<UploadedFiles> findByRel(BaseEntity entity) {
        return uploadedFilesRepository.findByRelTypeCodeAndRelId(entity.getModelName(), entity.getId());
    }

    @Transactional
    public void update(List<MultipartFile> files, String relType, Long relId, List<String> urllist) {
        List<UploadedFiles> uploadedFiles = uploadedFilesRepository.findByRelTypeCodeAndRelId(relType, relId);
        List<UploadedFiles> deletedFiles = new ArrayList<>();

        for(UploadedFiles uploadedfile : uploadedFiles){
            if(!urllist.contains(uploadedfile.getFileUrl()))
                deletedFiles.add(uploadedfile);
        }

        delete(deletedFiles);
        upload(files, relType, relId);

    }

    @Transactional
    public void delete(List<UploadedFiles> files) {

        for(UploadedFiles file : files){
            amazonS3.deleteObject(new DeleteObjectRequest(s3Config.getBucket(), file.getFileDir()));
            uploadedFilesRepository.delete(file);
        }

    }

    public List<String> getUrllist(String reltype, Long relId){
        List<UploadedFiles> uploadedFiles = uploadedFilesRepository.findByRelTypeCodeAndRelId(reltype, relId);
        List<String> urllist = new ArrayList<>();
        for(UploadedFiles file : uploadedFiles)
            urllist.add(file.getFileUrl());
        return urllist;
    }
}
