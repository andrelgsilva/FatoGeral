package com.fatogeral.backend.dto;

import com.fatogeral.backend.entity.Source;
import lombok.Data;

@Data
public class SourceResponse {
    private String url;
    private String title;
    private String description;

    public static SourceResponse from(Source source) {
        SourceResponse dto = new SourceResponse();
        dto.setUrl(source.getUrl());
        dto.setTitle(source.getTitle());
        dto.setDescription(source.getDescription());
        return dto;
    }
}