package com.RH.PFA.controller;

import com.RH.PFA.dto.PublicPulseDTO;
import com.RH.PFA.dto.TeamMemberDTO;
import com.RH.PFA.service.PublicService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/public")
@RequiredArgsConstructor
public class PublicController {

    private final PublicService publicService;

    @GetMapping("/pulse")
    public ResponseEntity<PublicPulseDTO> getPulse() {
        return ResponseEntity.ok(publicService.getCompanyPulse());
    }

    @GetMapping("/detailed")
    public ResponseEntity<java.util.Map<String, Object>> getDetailedStats() {
        return ResponseEntity.ok(publicService.getDetailedStats());
    }

    @GetMapping("/team")
    public ResponseEntity<List<TeamMemberDTO>> getTeam() {
        return ResponseEntity.ok(publicService.getPublicTeamMembers());
    }
}
