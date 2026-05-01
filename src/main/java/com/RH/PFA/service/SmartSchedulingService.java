package com.RH.PFA.service;

import com.RH.PFA.entity.Department;
import com.RH.PFA.entity.Leave;
import com.RH.PFA.entity.LeaveStatus;
import com.RH.PFA.repository.EmployeeRepository;
import com.RH.PFA.repository.LeaveRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class SmartSchedulingService {

    private final EmployeeRepository employeeRepository;
    private final LeaveRepository leaveRepository;

    /**
     * Analyzes if approving a leave will cause understaffing in the employee's department.
     */
    public boolean willCauseUnderstaffing(Leave leaveRequest) {
        Department department = leaveRequest.getEmployee().getDepartment();
        if (department == null) {
            return false;
        }

        long totalEmployeesInDept = employeeRepository.countByDepartmentId(department.getId());
        if (totalEmployeesInDept == 0) return false;

        // Find how many people are already on approved leave during this period in this department
        // For simplicity, we just fetch all approved leaves and filter in memory, 
        // though in production this should be a DB query.
        List<Leave> allApprovedLeaves = leaveRepository.findAll().stream()
                .filter(l -> l.getStatus() == LeaveStatus.APPROVED)
                .filter(l -> l.getEmployee().getDepartment() != null)
                .filter(l -> l.getEmployee().getDepartment().getId().equals(department.getId()))
                .filter(l -> datesOverlap(l.getStartDate(), l.getEndDate(), leaveRequest.getStartDate(), leaveRequest.getEndDate()))
                .toList();

        long employeesOnLeave = allApprovedLeaves.size();
        
        // If we approve this leave, 1 more person is on leave
        employeesOnLeave++;

        // Let's say understaffing means more than 30% of the team is away
        double leaveRatio = (double) employeesOnLeave / totalEmployeesInDept;
        
        log.info("Dept {}: {}/{} on leave. Ratio: {}", department.getName(), employeesOnLeave, totalEmployeesInDept, leaveRatio);
        
        return leaveRatio > 0.30;
    }

    private boolean datesOverlap(LocalDate start1, LocalDate end1, LocalDate start2, LocalDate end2) {
        return !start1.isAfter(end2) && !start2.isAfter(end1);
    }
}
