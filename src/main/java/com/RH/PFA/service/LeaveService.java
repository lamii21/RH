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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.context.ApplicationEventPublisher;
import com.RH.PFA.event.LeaveStatusChangedEvent;

import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class LeaveService {

    private final LeaveRepository leaveRepository;
    private final EmployeeRepository employeeRepository;
    private final ApplicationEventPublisher eventPublisher;
    private final SmartSchedulingService smartSchedulingService;

    @Transactional
    public LeaveResponseDTO requestLeave(LeaveRequestDTO request) {
        Employee employee = employeeRepository.findById(request.getEmployeeId())
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));

        if (request.getStartDate().isAfter(request.getEndDate())) {
            throw new IllegalArgumentException("Leave end date must be after start date");
        }

        long daysRequested = ChronoUnit.DAYS.between(request.getStartDate(), request.getEndDate()) + 1;
        if (employee.getLeaveBalance() < daysRequested) {
            throw new IllegalArgumentException("Insufficient leave balance");
        }

        Leave leave = Leave.builder()
                .employee(employee)
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .type(request.getType())
                .status(LeaveStatus.PENDING)
                .reason(request.getReason())
                .build();

        leave = leaveRepository.save(leave);
        eventPublisher.publishEvent(new LeaveStatusChangedEvent(this, leave));
        return mapToDTO(leave);
    }

    public Page<LeaveResponseDTO> getAllLeaves(Pageable pageable) {
        return leaveRepository.findAll(pageable).map(this::mapToDTO);
    }

    public List<LeaveResponseDTO> getEmployeeLeaves(Long employeeId) {
        return leaveRepository.findByEmployeeId(employeeId).stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Transactional
    public LeaveResponseDTO approveLeave(Long leaveId, String managerComment) {
        Leave leave = leaveRepository.findById(leaveId)
                .orElseThrow(() -> new ResourceNotFoundException("Leave request not found"));

        if (leave.getStatus() != LeaveStatus.PENDING) {
            throw new IllegalStateException("Leave already processed");
        }

        if (smartSchedulingService.willCauseUnderstaffing(leave)) {
            throw new IllegalStateException("Approving this leave will cause understaffing (>30% on leave) in the department.");
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

        leave = leaveRepository.save(leave);
        eventPublisher.publishEvent(new LeaveStatusChangedEvent(this, leave));
        return mapToDTO(leave);
    }

    @Transactional
    public LeaveResponseDTO rejectLeave(Long leaveId, String managerComment) {
        Leave leave = leaveRepository.findById(leaveId)
                .orElseThrow(() -> new ResourceNotFoundException("Leave request not found"));

        leave.setStatus(LeaveStatus.REJECTED);
        leave.setManagerComment(managerComment);
        leave = leaveRepository.save(leave);
        eventPublisher.publishEvent(new LeaveStatusChangedEvent(this, leave));
        return mapToDTO(leave);
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
