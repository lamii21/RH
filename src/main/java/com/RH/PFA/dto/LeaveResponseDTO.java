package com.RH.PFA.dto;

import com.RH.PFA.entity.LeaveStatus;
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
public class LeaveResponseDTO {
    private Long id;
    private Long employeeId;
    private String employeeName;
    private LocalDate startDate;
    private LocalDate endDate;
    private LeaveStatus status;
    private LeaveType type;
    private String reason;
    private String managerComment;
}
