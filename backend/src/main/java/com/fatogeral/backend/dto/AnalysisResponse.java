package com.fatogeral.backend.dto;

import com.fatogeral.backend.entity.Analysis;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Data
public class AnalysisResponse {
    private UUID id;
    private String verdict;
    private BigDecimal confidence;
    private String justification;
    private List<SourceResponse> sources;
    private String status;
    private LocalDateTime createdAt;

    public static AnalysisResponse from(Analysis analysis, List<SourceResponse> sources) {
        AnalysisResponse dto = new AnalysisResponse();
        dto.setId(analysis.getId());
        dto.setVerdict(analysis.getVerdict());
        dto.setConfidence(analysis.getConfidence());
        dto.setJustification(analysis.getJustification());
        dto.setSources(sources);
        dto.setStatus(analysis.getStatus().name());
        dto.setCreatedAt(analysis.getCreatedAt());
        return dto;
    }
}