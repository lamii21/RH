package com.RH.PFA.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ChurnPredictionResponse {
    private Long employeeId;
    private double churnProbability;
    private String riskLevel;
    private String recommendedAction;
}
