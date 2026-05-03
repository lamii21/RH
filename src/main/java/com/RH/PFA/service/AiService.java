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

    private static final String SYSTEM_PROMPT = """
            You are SmartHR Assistant, an intelligent AI that helps HR managers and employees \
            with questions about leaves, attendance, policies, scheduling, and general HR topics. \
            You work within the SmartHR platform which manages employees, departments, leave requests, \
            attendance tracking, and document storage. \
            Be concise, professional, and helpful. Answer in the same language as the question. \
            If asked about specific employee data you don't have, suggest checking the relevant module in SmartHR.""";

    /**
     * Calls an external churn prediction microservice.
     * Falls back to mock data if the service is unavailable.
     */
    public ChurnPredictionResponse predictChurn(Long employeeId) {
        log.info("Predicting churn for employee id: {}", employeeId);

        try {
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("employeeId", employeeId);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            ResponseEntity<ChurnPredictionResponse> response = restTemplate.exchange(
                    CHURN_SERVICE_URL, HttpMethod.POST, entity, ChurnPredictionResponse.class);

            if (response.getBody() != null) {
                log.info("Churn prediction received from ML service");
                return response.getBody();
            }
        } catch (Exception e) {
            log.warn("Churn prediction service unavailable, using fallback: {}", e.getMessage());
        }

        // Fallback: mock prediction
        double churnProbability = 0.1 + (0.8 - 0.1) * random.nextDouble();
        String riskLevel = churnProbability > 0.6 ? "HIGH" : (churnProbability > 0.3 ? "MEDIUM" : "LOW");

        return ChurnPredictionResponse.builder()
                .employeeId(employeeId)
                .churnProbability(Math.round(churnProbability * 100.0) / 100.0)
                .riskLevel(riskLevel)
                .recommendedAction(riskLevel.equals("HIGH")
                        ? "Schedule 1-on-1 immediately and review leave balance."
                        : "Normal monitoring.")
                .build();
    }

    /**
     * Calls Gemini API for HR copilot responses.
     * Falls back to keyword-based responses if API key is missing or call fails.
     */
    public AiCopilotResponse askCopilot(AiChatRequest request) {
        log.info("Copilot query from employee {}: {} message(s)",
                request.getEmployeeId(),
                request.getMessages() != null ? request.getMessages().size() : 0);

        if (geminiApiKey == null || geminiApiKey.isBlank()) {
            log.warn("GEMINI_API_KEY not configured, using fallback responses");
            return fallbackCopilot(request);
        }

        try {
            return callGemini(request);
        } catch (Exception e) {
            log.error("Gemini API call failed: {}", e.getMessage());
            return fallbackCopilot(request);
        }
    }

    private AiCopilotResponse callGemini(AiChatRequest request) {
        String url = GEMINI_URL + "?key=" + geminiApiKey;

        // Build contents array with system instruction + conversation history
        List<Map<String, Object>> contents = new ArrayList<>();

        // Add system instruction as first user message for context
        Map<String, Object> systemMsg = new HashMap<>();
        systemMsg.put("role", "user");
        systemMsg.put("parts", List.of(Map.of("text", SYSTEM_PROMPT + "\n\nPlease acknowledge and respond to the following conversation.")));
        contents.add(systemMsg);

        Map<String, Object> systemAck = new HashMap<>();
        systemAck.put("role", "model");
        systemAck.put("parts", List.of(Map.of("text", "Understood. I am SmartHR Assistant, ready to help with HR questions.")));
        contents.add(systemAck);

        // Add conversation history
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

        // Parse Gemini response
        try {
            JsonNode root = objectMapper.readTree(response.getBody());
            String answer = root.path("candidates").get(0)
                    .path("content").path("parts").get(0)
                    .path("text").asText();

            return AiCopilotResponse.builder()
                    .answer(answer)
                    .source("Google Gemini")
                    .build();
        } catch (Exception e) {
            log.error("Failed to parse Gemini response: {}", e.getMessage());
            return AiCopilotResponse.builder()
                    .answer("I received a response but couldn't process it. Please try again.")
                    .source("Error")
                    .build();
        }
    }

    private AiCopilotResponse fallbackCopilot(AiChatRequest request) {
        String lastMessage = "";
        if (request.getMessages() != null && !request.getMessages().isEmpty()) {
            lastMessage = request.getMessages().get(request.getMessages().size() - 1).getContent().toLowerCase();
        }

        String answer;
        if (lastMessage.contains("congé") || lastMessage.contains("leave")) {
            answer = "Based on the default configuration, employees start with 30 days of leave. You can check your current balance in the Dashboard or apply for leave in the Leaves section.";
        } else if (lastMessage.contains("salaire") || lastMessage.contains("salary")) {
            answer = "Salary details are confidential. Please refer to your latest payslip under the Documents section, or contact your HR manager directly.";
        } else if (lastMessage.contains("attendance") || lastMessage.contains("présence")) {
            answer = "You can check in and out from the Attendance page or the Dashboard widget. Arriving after 9:00 AM is marked as LATE. Working less than 4 hours is marked as HALF_DAY.";
        } else {
            answer = "I'm your SmartHR Assistant. I can help with leaves, attendance, policies, and general HR questions. Could you rephrase your question? (Note: Configure GEMINI_API_KEY for full AI responses)";
        }

        return AiCopilotResponse.builder()
                .answer(answer)
                .source("Fallback (no API key)")
                .build();
    }
}
