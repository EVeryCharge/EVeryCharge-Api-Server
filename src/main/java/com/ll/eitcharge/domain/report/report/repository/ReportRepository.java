package com.ll.eitcharge.domain.report.report.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ll.eitcharge.domain.report.report.entity.Report;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {

	Page<Report> findAll(Pageable pageable);
}
