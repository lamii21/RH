package com.RH.PFA.service;

import com.RH.PFA.dto.LeaveRequestDTO;
import com.RH.PFA.dto.LeaveResponseDTO;
import com.RH.PFA.entity.Employee;
import com.RH.PFA.entity.Leave;
import com.RH.PFA.entity.LeaveStatus;
import com.RH.PFA.exception.ResourceNotFoundException;
import com.RH.PFA.repository.EmployeeRepository;
import com.RH.PFA.repository.LeaveRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LeaveService {

    private final LeaveRepository leaveRepository;
    private final EmployeeRepository employeeRepository;

    @Transactional
    public LeaveResponseDTO requestLeave(LeaveRequestDTO request) {
        Employee employee = employeeRepository.findById(request.getEmployeeId())
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));

        Leave leave = Leave.builder()
                .employee(employee)
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .type(request.getType())
                .status(LeaveStatus.PENDING)
                .reason(request.getReason())
                .build();

        return mapToDTO(leaveRepository.save(leave));
    }

    public List<LeaveResponseDTO> getAllLeaves() {
        return leaveRepository.findAll().stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public List<LeaveResponseDTO> getEmployeeLeaves(Long employeeId) {
        return leaveRepository.findByEmployeeId(employeeId).stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Transactional
    public LeaveResponseDTO approveLeave(Long leaveId, String managerComment) {
        Leave leave = leaveRepository.findById(leaveId)
                .orElseThrow(() -> new ResourceNotFoundException("Leave request not found"));

        if (leave.getStatus() != LeaveStatus.PENDING) {
            throw new IllegalStateException("Leave is already processed");
        }

        leave.setStatus(LeaveStatus.APPROVED);
        leave.setManagerComment(managerComment);

        long daysRequested = ChronoUnit.DAYS.between(leave.getStartDate(), leave.getEndDate()) + 1;
        Employee employee = leave.getEmployee();
        
        if (employee.getLeaveBalance() < daysRequested) {
            throw new IllegalStateException("Not enough leave balance");
        }
        
        employee.setLeaveBalance((int) (employee.getLeaveBalance() - daysRequested));
        employeeRepository.save(employee);

        return mapToDTO(leaveRepository.save(leave));
    }

    @Transactional
    public LeaveResponseDTO rejectLeave(Long leaveId, String managerComment) {
        Leave leave = leaveRepository.findById(leaveId)
                .orElseThrow(() -> new ResourceNotFoundException("Leave request not found"));

        leave.setStatus(LeaveStatus.REJECTED);
        leave.setManagerComment(managerComment);
        return mapToDTO(leaveRepository.save(leave));
    }

    private LeaveResponseDTO mapToDTO(Leave leave) {
        return LeaveResponseDTO.builder()
                .id(leave.getId())
                .employeeId(leave.getEmployee().getId())
                .employeeName(leave.getEmployee().getFirstName() + " " + leave.getEmployee().getLastName())
                .startDate(leave.getStartDate())
                .endDate(leave.getEndDate())
                .status(leave.getStatus())
                .type(leave.getType())
                .reason(leave.getReason())
                .managerComment(leave.getManagerComment())
                .build();
    }
}
