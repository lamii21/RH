package com.RH.PFA.service;

import com.RH.PFA.entity.Department;
import com.RH.PFA.entity.Leave;
import com.RH.PFA.entity.LeaveStatus;
import com.RH.PFA.repository.EmployeeRepository;
import com.RH.PFA.repository.LeaveRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class SmartSchedulingService {

    private final EmployeeRepository employeeRepository;
    private final LeaveRepository leaveRepository;

    /**
     * Analyzes if approving a leave will cause understaffing in the employee's department.
     * Uses optimized DB query instead of loading all leaves into memory.
     */
    public boolean willCauseUnderstaffing(Leave leaveRequest) {
        Department department = leaveRequest.getEmployee().getDepartment();
        if (department == null) {
            return false;
        }

        long totalEmployeesInDept = employeeRepository.countByDepartmentId(department.getId());
        if (totalEmployeesInDept == 0) return false;

        // Optimized: use targeted DB query instead of loading all leaves
        List<Leave> overlappingLeaves = leaveRepository.findOverlappingApprovedLeaves(
                LeaveStatus.APPROVED,
                department.getId(),
                leaveRequest.getStartDate(),
                leaveRequest.getEndDate());

        long employeesOnLeave = overlappingLeaves.size();
        
        // If we approve this leave, 1 more person is on leave
        employeesOnLeave++;

        // Understaffing means more than 30% of the team is away
        double leaveRatio = (double) employeesOnLeave / totalEmployeesInDept;
        
        log.info("Dept {}: {}/{} on leave. Ratio: {}", department.getName(), employeesOnLeave, totalEmployeesInDept, leaveRatio);
        
        return leaveRatio > 0.30;
    }
}
