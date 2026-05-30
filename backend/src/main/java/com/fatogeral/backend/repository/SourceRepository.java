package com.fatogeral.backend.repository;

import com.fatogeral.backend.entity.Source;
import com.fatogeral.backend.entity.Analysis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SourceRepository extends JpaRepository<Source, UUID> {
    List<Source> findByAnalysis(Analysis analysis);
}