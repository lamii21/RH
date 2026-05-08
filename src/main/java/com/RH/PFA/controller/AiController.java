package com.RH.PFA.controller;

import com.RH.PFA.dto.AiChatRequest;
import com.RH.PFA.dto.AiCopilotResponse;
import com.RH.PFA.dto.ChurnPredictionResponse;
import com.RH.PFA.service.AiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/ai")
@RequiredArgsConstructor
public class AiController {

    private final AiService aiService;

    @GetMapping("/churn/{employeeId}")
    public ResponseEntity<ChurnPredictionResponse> predictChurn(@PathVariable Long employeeId) {
        return ResponseEntity.ok(aiService.predictChurn(employeeId));
    }

    @PostMapping("/copilot")
    public ResponseEntity<AiCopilotResponse> askCopilot(@RequestBody AiChatRequest request) {
        return ResponseEntity.ok(aiService.askCopilot(request));
    }

    @PostMapping("/public/chat")
    public ResponseEntity<AiCopilotResponse> askPublicChat(@RequestBody AiChatRequest request) {
        return ResponseEntity.ok(aiService.askPublicChat(request));
    }
}
