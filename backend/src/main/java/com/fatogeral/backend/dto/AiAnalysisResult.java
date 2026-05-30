package com.fatogeral.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AiAnalysisResult {
    private String verdict;
    private double confidence;
    private String justification;
    private List<SourceResponse> sources;
}