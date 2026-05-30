package com.fatogeral.backend.repository;

import com.fatogeral.backend.entity.Analysis;
import com.fatogeral.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AnalysisRepository extends JpaRepository<Analysis, UUID> {
    List<Analysis> findByUser(User user);
    List<Analysis> findAllByOrderByCreatedAtDesc();
}