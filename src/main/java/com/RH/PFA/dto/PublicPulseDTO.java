package com.RH.PFA.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PublicPulseDTO {
    private long totalEmployees;
    private long totalDepartments;
    private double growthPercent;
    private String companyMood;   // SUNNY, PARTLY_CLOUDY, CLOUDY, RAINY
    private int moodScore;        // 0-100
    private long openPositions;
}
