package com.fatogeral.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TrendResponse {
    private String verdict;
    private Long count;
}