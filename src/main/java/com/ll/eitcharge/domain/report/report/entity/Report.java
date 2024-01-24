package com.ll.eitcharge.domain.report.report;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.*;

import java.time.LocalDateTime;

import static lombok.AccessLevel.PROTECTED;

@Entity
@NoArgsConstructor(access = PROTECTED)
@AllArgsConstructor(access = PROTECTED)
@Builder
@Getter
@Setter
public class Report {
    @Id
    @GeneratedValue
    private Long id;

    private String content;
    private String reportType;
    private LocalDateTime createdDate;
    private LocalDateTime modifiedDate;
}
