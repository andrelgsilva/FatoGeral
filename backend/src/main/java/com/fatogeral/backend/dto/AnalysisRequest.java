package com.fatogeral.backend.dto;

import jakarta.validation.constraints.AssertTrue;
import lombok.Data;

@Data
public class AnalysisRequest {

    private String inputText;
    private String inputUrl;

    @AssertTrue(message = "Informe ao menos um texto ou URL para análise")
    public boolean isAtLeastOneProvided() {
        return (inputText != null && !inputText.isBlank()) ||
               (inputUrl != null && !inputUrl.isBlank());
    }
}