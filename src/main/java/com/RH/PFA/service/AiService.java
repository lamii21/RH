package com.RH.PFA.service;

import com.RH.PFA.dto.AiChatRequest;
import com.RH.PFA.dto.AiCopilotResponse;
import com.RH.PFA.dto.ChatMessage;
import com.RH.PFA.dto.ChurnPredictionResponse;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
@Slf4j
public class AiService {

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final Random random = new Random();

    @Value("${gemini.api.key:}")
    private String geminiApiKey;

    private static final String GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
    private static final String CHURN_SERVICE_URL = "http://localhost:8000/predict/churn";

    private static final String SYSTEM_PROMPT_INTERNAL = """
            You are NEXUS Assistant, an intelligent AI for Lotissement Annassim 2. \
            You help employees and managers with HR tasks: leaves, attendance, policies, and scheduling. \
            Be professional, concise, and helpful. Use the same language as the user (FR/AR/EN).""";

    private static final String SYSTEM_PROMPT_PUBLIC = """
            You are NEXUS Public Assistant for Lotissement Annassim 2. \
            You help visitors and candidates with information about our real estate projects, \
            our company culture, and our recruitment process. \
            Lotissement Annassim 2 is a high-end residential lot project in Jorf El Melha. \
            Be welcoming, persuasive, and professional. Use the same language as the user (FR/AR/EN).""";

    public ChurnPredictionResponse predictChurn(Long employeeId) {
        double churnProbability = 0.1 + (0.8 - 0.1) * random.nextDouble();
        String riskLevel = churnProbability > 0.6 ? "HIGH" : (churnProbability > 0.3 ? "MEDIUM" : "LOW");
        return ChurnPredictionResponse.builder()
                .employeeId(employeeId)
                .churnProbability(Math.round(churnProbability * 100.0) / 100.0)
                .riskLevel(riskLevel)
                .recommendedAction(riskLevel.equals("HIGH") ? "Schedule 1-on-1 immediately." : "Monitor.")
                .build();
    }

    public AiCopilotResponse askPublicChat(AiChatRequest request) {
        if (geminiApiKey == null || geminiApiKey.isBlank()) return fallbackPublic(request);
        try {
            return callGemini(request, SYSTEM_PROMPT_PUBLIC);
        } catch (Exception e) {
            return fallbackPublic(request);
        }
    }

    public AiCopilotResponse askCopilot(AiChatRequest request) {
        if (geminiApiKey == null || geminiApiKey.isBlank()) return fallbackCopilot(request);
        try {
            return callGemini(request, SYSTEM_PROMPT_INTERNAL);
        } catch (Exception e) {
            return fallbackCopilot(request);
        }
    }

    private AiCopilotResponse callGemini(AiChatRequest request, String systemPrompt) {
        String url = GEMINI_URL + "?key=" + geminiApiKey;
        List<Map<String, Object>> contents = new ArrayList<>();

        Map<String, Object> systemMsg = new HashMap<>();
        systemMsg.put("role", "user");
        systemMsg.put("parts", List.of(Map.of("text", systemPrompt + "\n\nPlease respond to the user query.")));
        contents.add(systemMsg);

        Map<String, Object> systemAck = new HashMap<>();
        systemAck.put("role", "model");
        systemAck.put("parts", List.of(Map.of("text", "Understood. How can I help you today?")));
        contents.add(systemAck);

        if (request.getMessages() != null) {
            for (ChatMessage msg : request.getMessages()) {
                Map<String, Object> content = new HashMap<>();
                content.put("role", "user".equals(msg.getRole()) ? "user" : "model");
                content.put("parts", List.of(Map.of("text", msg.getContent())));
                contents.add(content);
            }
        }

        Map<String, Object> body = new HashMap<>();
        body.put("contents", contents);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);

        try {
            JsonNode root = objectMapper.readTree(response.getBody());
            String answer = root.path("candidates").get(0).path("content").path("parts").get(0).path("text").asText();
            return AiCopilotResponse.builder().answer(answer).source("NEXUS AI (Gemini)").build();
        } catch (Exception e) {
            throw new RuntimeException("Parse error");
        }
    }

    private AiCopilotResponse fallbackPublic(AiChatRequest request) {
        return AiCopilotResponse.builder()
                .answer("Bienvenue chez Annassim 2 ! Je peux vous renseigner sur nos lots résidentiels à Jorf El Melha ou sur nos opportunités de carrière. Que souhaitez-vous savoir ?")
                .source("NEXUS Assistant")
                .build();
    }

    private AiCopilotResponse fallbackCopilot(AiChatRequest request) {
        return AiCopilotResponse.builder()
                .answer("Bonjour ! En tant qu'assistant RH, je peux vous aider pour vos congés, vos présences ou nos politiques internes. (Configurez Gemini pour une aide plus poussée)")
                .source("NEXUS Assistant")
                .build();
    }
}
