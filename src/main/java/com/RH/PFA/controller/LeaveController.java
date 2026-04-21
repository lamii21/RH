package com.RH.PFA.controller;

import com.RH.PFA.dto.LeaveRequestDTO;
import com.RH.PFA.dto.LeaveResponseDTO;
import com.RH.PFA.service.LeaveService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/leaves")
@RequiredArgsConstructor
public class LeaveController {

    private final LeaveService leaveService;

    @PostMapping
    public ResponseEntity<LeaveResponseDTO> requestLeave(@RequestBody LeaveRequestDTO request) {
        return new ResponseEntity<>(leaveService.requestLeave(request), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<LeaveResponseDTO>> getAllLeaves() {
        return ResponseEntity.ok(leaveService.getAllLeaves());
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<LeaveResponseDTO>> getEmployeeLeaves(@PathVariable Long employeeId) {
        return ResponseEntity.ok(leaveService.getEmployeeLeaves(employeeId));
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<LeaveResponseDTO> approveLeave(@PathVariable Long id, @RequestParam(required = false) String comment) {
        return ResponseEntity.ok(leaveService.approveLeave(id, comment));
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<LeaveResponseDTO> rejectLeave(@PathVariable Long id, @RequestParam(required = false) String comment) {
        return ResponseEntity.ok(leaveService.rejectLeave(id, comment));
    }
}
