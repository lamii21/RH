package com.RH.PFA.dto;

import com.RH.PFA.entity.LeaveType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LeaveRequestDTO {
    private Long employeeId;
    private LocalDate startDate;
    private LocalDate endDate;
    private LeaveType type;
    private String reason;
}
