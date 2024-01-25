package com.ll.eitcharge.domain.technicalManager.technicalManager.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ll.eitcharge.domain.technicalManager.technicalManager.entity.TechnicalManager;

public interface TechnicalManagerRepository extends JpaRepository<TechnicalManager, Long> {
	Optional<TechnicalManager> findByName(String name);
}
