package com.RH.PFA.service;

import com.RH.PFA.dto.DashboardDTO;
import com.RH.PFA.dto.RiskyEmployeeDTO;
import com.RH.PFA.entity.Attendance;
import com.RH.PFA.entity.AttendanceStatus;
import com.RH.PFA.entity.LeaveStatus;
import com.RH.PFA.repository.AttendanceRepository;
import com.RH.PFA.repository.DepartmentRepository;
import com.RH.PFA.repository.EmployeeRepository;
import com.RH.PFA.repository.LeaveRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final LeaveRepository leaveRepository;
    private final AttendanceRepository attendanceRepository;

    public DashboardDTO getDashboardStats() {
        long totalEmployees = employeeRepository.count();
        long totalDepartments = departmentRepository.count();

        long leavesPending = leaveRepository.findAll().stream()
                .filter(l -> l.getStatus() == LeaveStatus.PENDING).count();

        LocalDate today = LocalDate.now();
        List<Attendance> allAttendances = attendanceRepository.findAll();

        long todayAbsences = allAttendances.stream()
                .filter(a -> a.getDate().equals(today) && a.getStatus() == AttendanceStatus.ABSENT)
                .count();

        Map<String, Long> employeesPerDepartment = employeeRepository.findAll().stream()
                .filter(e -> e.getDepartment() != null)
                .collect(Collectors.groupingBy(
                        e -> e.getDepartment().getName(),
                        Collectors.counting()
                ));

        // Intelligence Layer Logic: Calculate risky employees
        Map<Long, List<Attendance>> attendanceByEmployee = allAttendances.stream()
                .collect(Collectors.groupingBy(a -> a.getEmployee().getId()));

        List<RiskyEmployeeDTO> riskyEmployees = attendanceByEmployee.entrySet().stream()
                .map(entry -> {
                    long absenceCount = entry.getValue().stream().filter(a -> a.getStatus() == AttendanceStatus.ABSENT).count();
                    long lateCount = entry.getValue().stream().filter(a -> a.getStatus() == AttendanceStatus.LATE).count();
                    
                    String riskLevel = "LOW";
                    if (absenceCount >= 3 || lateCount >= 5) {
                        riskLevel = "HIGH";
                    } else if (absenceCount >= 1 || lateCount >= 3) {
                        riskLevel = "MEDIUM";
                    }

                    if (!riskLevel.equals("LOW")) {
                        var employee = employeeRepository.findById(entry.getKey()).orElse(null);
                        if (employee != null) {
                            return RiskyEmployeeDTO.builder()
                                    .employeeId(employee.getId())
                                    .employeeName(employee.getFirstName() + " " + employee.getLastName())
                                    .absenceCount(absenceCount)
                                    .lateCount(lateCount)
                                    .riskLevel(riskLevel)
                                    .build();
                        }
                    }
                    return null;
                })
                .filter(dto -> dto != null)
                .collect(Collectors.toList());

        return DashboardDTO.builder()
                .totalEmployees(totalEmployees)
                .totalDepartments(totalDepartments)
                .leavesPending(leavesPending)
                .todayAbsences(todayAbsences)
                .employeesPerDepartment(employeesPerDepartment)
                .riskyEmployees(riskyEmployees)
                .build();
    }
}
