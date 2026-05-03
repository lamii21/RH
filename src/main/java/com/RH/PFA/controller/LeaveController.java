package com.RH.PFA.controller;

import com.RH.PFA.dto.LeaveRequestDTO;
import com.RH.PFA.dto.LeaveResponseDTO;
import com.RH.PFA.service.LeaveService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/leaves")
@RequiredArgsConstructor
public class LeaveController {

    private final LeaveService leaveService;

    @PostMapping
    public ResponseEntity<LeaveResponseDTO> requestLeave(@jakarta.validation.Valid @RequestBody LeaveRequestDTO request) {
        return new ResponseEntity<>(leaveService.requestLeave(request), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<Page<LeaveResponseDTO>> getAllLeaves(
            @PageableDefault(size = 20, sort = "id") Pageable pageable) {
        return ResponseEntity.ok(leaveService.getAllLeaves(pageable));
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<LeaveResponseDTO>> getEmployeeLeaves(@PathVariable Long employeeId) {
        return ResponseEntity.ok(leaveService.getEmployeeLeaves(employeeId));
    }

    @PutMapping("/{id}/approve")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<LeaveResponseDTO> approveLeave(@PathVariable Long id, @RequestParam(required = false) String comment) {
        return ResponseEntity.ok(leaveService.approveLeave(id, comment));
    }

    @PutMapping("/{id}/reject")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<LeaveResponseDTO> rejectLeave(@PathVariable Long id, @RequestParam(required = false) String comment) {
        return ResponseEntity.ok(leaveService.rejectLeave(id, comment));
    }
}
