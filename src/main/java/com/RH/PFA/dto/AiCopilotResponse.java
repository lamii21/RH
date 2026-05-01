package com.RH.PFA.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AiCopilotResponse {
    private String answer;
    private String source;
}
