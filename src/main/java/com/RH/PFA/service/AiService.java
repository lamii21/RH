package com.RH.PFA.service;

import com.RH.PFA.dto.AiCopilotResponse;
import com.RH.PFA.dto.ChurnPredictionResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Random;

@Service
@Slf4j
public class AiService {

    private final Random random = new Random();

    /**
     * Mocks a connection to a Machine Learning Model predicting employee churn.
     * In V2 Production, this would call an external FastAPI/Python microservice.
     */
    public ChurnPredictionResponse predictChurn(Long employeeId) {
        log.info("Predicting churn for employee id: {}", employeeId);
        
        // Mocking ML result
        double churnProbability = 0.1 + (0.8 - 0.1) * random.nextDouble();
        String riskLevel = churnProbability > 0.6 ? "HIGH" : (churnProbability > 0.3 ? "MEDIUM" : "LOW");
        
        return ChurnPredictionResponse.builder()
                .employeeId(employeeId)
                .churnProbability(Math.round(churnProbability * 100.0) / 100.0)
                .riskLevel(riskLevel)
                .recommendedAction(riskLevel.equals("HIGH") ? "Schedule 1-on-1 immediately and review leave balance." : "Normal monitoring.")
                .build();
    }

    /**
     * Mocks a generative AI Assistant for HR queries.
     */
    public AiCopilotResponse askCopilot(String query, Long employeeId) {
        log.info("Copilot query from {}: {}", employeeId, query);
        
        // Extremely simple keyword-based mock
        String answer;
        if (query.toLowerCase().contains("congé") || query.toLowerCase().contains("leave")) {
            answer = "Based on your current balance, you have 30 days left. You can apply for a leave via the quick widget.";
        } else if (query.toLowerCase().contains("salaire") || query.toLowerCase().contains("salary")) {
            answer = "Your salary details are confidential. Please refer to your latest payslip under the Documents section.";
        } else {
            answer = "I am your SmartHR Assistant. I can help you with leaves, scheduling, and general policies. Could you rephrase your question?";
        }

        return AiCopilotResponse.builder()
                .answer(answer)
                .source("Mock AI Model v2")
                .build();
    }
}
