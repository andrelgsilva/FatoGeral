package com.fatogeral.backend.integration;

import com.fatogeral.backend.dto.AiAnalysisResult;
import com.fatogeral.backend.dto.SourceResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

@Profile("prod")
@Service
public class GeminiAiIntegrationService implements AiIntegrationPort {

    private final RestClient restClient;
    private final String apiKey;
    private final String apiUrl;

    public GeminiAiIntegrationService(
            @Value("${gemini.api-key}") String apiKey,
            @Value("${gemini.api-url}") String apiUrl,
            @Value("${gemini.timeout-ms}") int timeout
    ) {
        this.apiKey = apiKey;
        this.apiUrl = apiUrl;

        SimpleClientHttpRequestFactory factory =
                new SimpleClientHttpRequestFactory();

        factory.setConnectTimeout(timeout);
        factory.setReadTimeout(timeout);

        this.restClient = RestClient.builder()
                .requestFactory(factory)
                .build();
    }

    @Override
    public AiAnalysisResult analyze(String content) {

        String prompt = """
                Você é um verificador de fake news.

                Analise o conteúdo abaixo e responda:
                1. Veredito
                2. Confiança de 0 a 1
                3. Justificativa curta

                Conteúdo:
                %s
                """.formatted(content);

        Map<String, Object> body = Map.of(
                "contents", List.of(
                        Map.of(
                                "parts", List.of(
                                        Map.of("text", prompt)
                                )
                        )
                )
        );

        Map response = restClient.post()
                .uri(apiUrl + "?key=" + apiKey)
                .body(body)
                .retrieve()
                .body(Map.class);

        String text = extractText(response);

        return new AiAnalysisResult(
                "Análise gerada pela IA",
                0.80,
                text,
                List.<SourceResponse>of()
        );
    }

    private String extractText(Map response) {

        List candidates = (List) response.get("candidates");

        Map candidate = (Map) candidates.get(0);

        Map content = (Map) candidate.get("content");

        List parts = (List) content.get("parts");

        Map part = (Map) parts.get(0);

        return String.valueOf(part.get("text"));
    }
}