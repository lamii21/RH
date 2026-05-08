package com.RH.PFA.controller;

import com.RH.PFA.dto.EmployeeDTO;
import com.RH.PFA.dto.EmployeeRequest;
import com.RH.PFA.service.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/employees")
@RequiredArgsConstructor
public class EmployeeController {

    private final EmployeeService employeeService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EmployeeDTO> createEmployee(@jakarta.validation.Valid @RequestBody EmployeeRequest request) {
        return new ResponseEntity<>(employeeService.createEmployee(request), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<Page<EmployeeDTO>> getAllEmployees(
            @PageableDefault(size = 20, sort = "id") Pageable pageable) {
        return ResponseEntity.ok(employeeService.getAllEmployees(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmployeeDTO> getEmployeeById(@PathVariable Long id) {
        return ResponseEntity.ok(employeeService.getEmployeeById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<EmployeeDTO> updateEmployee(@PathVariable Long id, @jakarta.validation.Valid @RequestBody EmployeeRequest request) {
        return ResponseEntity.ok(employeeService.updateEmployee(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteEmployee(@PathVariable Long id) {
        employeeService.deleteEmployee(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/me")
    public ResponseEntity<EmployeeDTO> getMyProfile(java.security.Principal principal) {
        return ResponseEntity.ok(employeeService.getEmployeeByEmail(principal.getName()));
    }

    @PutMapping("/me")
    public ResponseEntity<EmployeeDTO> updateMyProfile(
            java.security.Principal principal,
            @RequestParam(required = false) String bio,
            @RequestParam(required = false) String avatarUrl,
            @RequestParam(required = false) Boolean isPublicProfile) {
        return ResponseEntity.ok(employeeService.updateProfile(principal.getName(), bio, avatarUrl, isPublicProfile));
    }
}
