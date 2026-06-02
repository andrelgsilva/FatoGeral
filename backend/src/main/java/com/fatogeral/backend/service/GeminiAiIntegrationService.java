package com.fatogeral.backend.integration;

import com.fatogeral.backend.dto.AiAnalysisResult;
import com.fatogeral.backend.dto.SourceResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
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

        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(timeout);
        factory.setReadTimeout(timeout);

        this.restClient = RestClient.builder()
                .requestFactory(factory)
                .build();
    }

    @Override
    public AiAnalysisResult analyze(String content) {

        String prompt = """
                Você é um verificador de fake news profissional.

                Analise o conteúdo abaixo e responda APENAS com um JSON válido, sem texto adicional, sem markdown, sem explicações fora do JSON.

                Formato obrigatório:
                {
                  "verdict": "string curta com o veredicto (ex: Fake News, Verdadeiro, Inconclusivo)",
                  "confidence": número entre 0.0 e 1.0,
                  "justification": "explicação objetiva em até 3 frases"
                }

                Conteúdo a analisar:
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
        return parseResult(text);
    }

    private String extractText(Map response) {
        List candidates = (List) response.get("candidates");
        Map candidate = (Map) candidates.get(0);
        Map content = (Map) candidate.get("content");
        List parts = (List) content.get("parts");
        Map part = (Map) parts.get(0);
        return String.valueOf(part.get("text"));
    }

    private AiAnalysisResult parseResult(String text) {
        try {
            String clean = text.replaceAll("```json", "").replaceAll("```", "").trim();

            ObjectMapper mapper = new ObjectMapper();
            Map<String, Object> json = mapper.readValue(clean, Map.class);

            String verdict = String.valueOf(json.get("verdict"));
            double confidence = Double.parseDouble(String.valueOf(json.get("confidence")));
            String justification = String.valueOf(json.get("justification"));

            return new AiAnalysisResult(verdict, confidence, justification, List.of());

        } catch (Exception e) {
            return new AiAnalysisResult("Inconclusivo", 0.0, text, List.of());
        }
    }
}