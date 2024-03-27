package com.ll.everycharge.domain.base.uploadedfiles.entity;

import com.ll.everycharge.global.jpa.entity.BaseTime;
import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import static lombok.AccessLevel.PROTECTED;

@Entity
@NoArgsConstructor(access = PROTECTED)
@AllArgsConstructor(access = PROTECTED)
@Builder(toBuilder = true)
@Getter
public class UploadedFiles extends BaseTime {
    private String fileName; //저장될 파일 이름
    private String relTypeCode; //파일 소속 코드
    private Long relId; // 구분된 파일 소속의 식별 ID
    private Long fileSize; //파일 크기
    private String fileExt; //확장자
    private String fileDir; //저장된 경로
    private String fileUrl; //파일 url
    private String originFileName; //원본 이름


}
