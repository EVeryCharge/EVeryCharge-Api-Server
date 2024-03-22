package com.ll.eitcharge.domain.base.uploadedfiles.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.DeleteObjectRequest;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.ll.eitcharge.domain.base.uploadedfiles.entity.UploadedFiles;
import com.ll.eitcharge.domain.base.uploadedfiles.repository.UploadedFilesRepository;
import com.ll.eitcharge.domain.inquiry.inquiry.entity.Inquiry;
import com.ll.eitcharge.global.app.AppConfig;
import com.ll.eitcharge.global.aws.s3.S3Config;
import com.ll.eitcharge.global.exceptions.GlobalException;
import com.ll.eitcharge.global.jpa.entity.BaseEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

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
    public void delete(List<UploadedFiles> files) {

        for(UploadedFiles file : files){
            amazonS3.deleteObject(new DeleteObjectRequest(s3Config.getBucket(), file.getFileDir()));
            uploadedFilesRepository.delete(file);
        }

    }


//    @Transactional
//    public GenFile save(String relTypeCode, long relId, String typeCode, String type2Code, int fileNo, String filePath) {
//        String originFileName = Ut.file.getOriginFileName(filePath);
//        String fileExt = Ut.file.getExt(originFileName);
//        String fileExtTypeCode = Ut.file.getFileExtTypeCodeFromFileExt(fileExt);
//        String fileExtType2Code = Ut.file.getFileExtType2CodeFromFileExt(fileExt);
//        long fileSize = new File(filePath).length();
//        String fileDir = getCurrentDirName(relTypeCode);
//        String fileName = UUID.randomUUID() + "." + fileExt;
//
//        GenFile genFile = genFileRepository
//                .findByRelTypeCodeAndRelIdAndTypeCodeAndType2CodeAndFileNo(
//                        relTypeCode, relId, typeCode, type2Code, fileNo
//                )
//                .orElse(null);
//
//        if (genFile != null) {
//            genFile.deleteOnDisk();
//
//            genFile.setOriginFileName(originFileName);
//            genFile.setFileExtTypeCode(fileExtTypeCode);
//            genFile.setFileExtType2Code(fileExtType2Code);
//            genFile.setFileExt(fileExt);
//            genFile.setFileSize(fileSize);
//            genFile.setFileDir(fileDir);
//            genFile.setFileName(fileName);
//        } else {
//            genFile = GenFile.builder()
//                    .fileName(fileName)
//                    .relTypeCode(relTypeCode)
//                    .relId(relId)
//                    .typeCode(typeCode)
//                    .type2Code(type2Code)
//                    .fileNo(fileNo)
//                    .fileExtTypeCode(fileExtTypeCode)
//                    .fileExtType2Code(fileExtType2Code)
//                    .fileSize(fileSize)
//                    .fileExt(fileExt)
//                    .fileDir(fileDir)
//                    .originFileName(originFileName)
//                    .build();
//
//            genFileRepository.save(genFile);
//        }
//
//        File file = new File(genFile.getFilePath());
//
//        file.getParentFile().mkdirs();
//
//        Ut.file.moveFile(filePath, file);
//        Ut.file.remove(filePath);
//
//        return genFile;
//    }
//

//
//    public Optional<GenFile> findByFileName(String fileName) {
//        return genFileRepository.findByFileName(fileName);
//    }
//


}
