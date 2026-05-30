package com.fatogeral.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ReviewRequest {

    @NotBlank(message = "Veredito é obrigatório")
    private String verdict;

    private String justification;
}