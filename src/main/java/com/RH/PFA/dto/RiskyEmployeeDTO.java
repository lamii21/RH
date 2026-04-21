package com.RH.PFA.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RiskyEmployeeDTO {
    private Long employeeId;
    private String employeeName;
    private long absenceCount;
    private long lateCount;
    private String riskLevel; // e.g., "HIGH", "MEDIUM"
}
