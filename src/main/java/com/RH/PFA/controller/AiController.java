package com.RH.PFA.controller;

import com.RH.PFA.dto.AiCopilotResponse;
import com.RH.PFA.dto.ChurnPredictionResponse;
import com.RH.PFA.service.AiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Assuming we want broad access for dev
public class AiController {

    private final AiService aiService;

    @GetMapping("/churn/{employeeId}")
    public ResponseEntity<ChurnPredictionResponse> predictChurn(@PathVariable Long employeeId) {
        return ResponseEntity.ok(aiService.predictChurn(employeeId));
    }

    @GetMapping("/copilot")
    public ResponseEntity<AiCopilotResponse> askCopilot(@RequestParam String query, @RequestParam Long employeeId) {
        return ResponseEntity.ok(aiService.askCopilot(query, employeeId));
    }
}
