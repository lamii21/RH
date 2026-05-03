package com.RH.PFA.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DocumentDTO {
    private Long id;
    private Long employeeId;
    private String employeeName;
    private String fileName;
    private String documentType;
    private LocalDateTime uploadedAt;
}
