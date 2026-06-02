package com.fatogeral.backend.dto;

import jakarta.validation.constraints.AssertTrue;
import lombok.Data;

@Data
public class AnalysisRequest {

    private String Text;
    private String url;

    @AssertTrue(message = "Informe ao menos um texto ou URL para análise")
    public boolean isAtLeastOneProvided() {
        return (inputText != null && !inputText.isBlank()) ||
               (inputUrl != null && !inputUrl.isBlank());
    }
}