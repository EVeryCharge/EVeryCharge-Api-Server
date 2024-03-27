package com.ll.eitcharge.domain.base.uploadedfiles.repository;

import com.ll.eitcharge.domain.base.uploadedfiles.entity.UploadedFiles;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UploadedFilesRepository extends JpaRepository<UploadedFiles, Long> {
    List<UploadedFiles> findByRelTypeCodeAndRelId(String relTypeCode, long relId);



}
