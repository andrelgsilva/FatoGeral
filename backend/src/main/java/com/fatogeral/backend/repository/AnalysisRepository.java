package com.fatogeral.backend.repository;

import com.fatogeral.backend.dto.TrendResponse;
import com.fatogeral.backend.entity.Analysis;
import com.fatogeral.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AnalysisRepository extends JpaRepository<Analysis, UUID> {
    List<Analysis> findByUser(User user);
    List<Analysis> findAllByOrderByCreatedAtDesc();

    @Query("SELECT new com.fatogeral.backend.dto.TrendResponse(a.verdict, COUNT(a)) " +
           "FROM Analysis a " +
           "WHERE a.status = 'DONE' AND a.verdict IS NOT NULL " +
           "GROUP BY a.verdict " +
           "ORDER BY COUNT(a) DESC")
    List<TrendResponse> findTopVerdicts();
}