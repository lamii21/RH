package com.RH.PFA.service;

import com.RH.PFA.dto.PublicPulseDTO;
import com.RH.PFA.dto.TeamMemberDTO;
import com.RH.PFA.entity.AttendanceStatus;
import com.RH.PFA.repository.AttendanceRepository;
import com.RH.PFA.repository.DepartmentRepository;
import com.RH.PFA.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PublicService {

    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final AttendanceRepository attendanceRepository;

    public PublicPulseDTO getCompanyPulse() {
        long totalEmployees = employeeRepository.count();
        long presentToday = attendanceRepository.countByDateAndStatus(LocalDate.now(), AttendanceStatus.PRESENT);
        
        double attendanceRate = totalEmployees > 0 ? (double) presentToday / totalEmployees : 0;
        String mood = attendanceRate > 0.9 ? "EXCELLENT" : (attendanceRate > 0.7 ? "GOOD" : "FROID");

        return PublicPulseDTO.builder()
                .employeeCount((int) totalEmployees)
                .presentToday((int) presentToday)
                .growthRate(12.5) // Mock
                .mood(mood)
                .lastUpdate(LocalDateTime.now())
                .build();
    }

    public Map<String, Object> getDetailedStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("departmentDistribution", employeeRepository.countEmployeesByDepartment());
        stats.put("hiringTrend", List.of(
            Map.of("month", "Jan", "hires", 2),
            Map.of("month", "Feb", "hires", 5),
            Map.of("month", "Mar", "hires", 3),
            Map.of("month", "Apr", "hires", 8)
        ));
        stats.put("hiringPrediction", 12.0); // AI Mock
        return stats;
    }

    public List<TeamMemberDTO> getPublicTeamMembers() {
        return employeeRepository.findByIsPublicProfileTrue().stream()
                .map(emp -> TeamMemberDTO.builder()
                        .id(emp.getId())
                        .firstName(emp.getFirstName())
                        .lastName(emp.getLastName())
                        .jobTitle(emp.getJobTitle())
                        .departmentName(emp.getDepartment() != null ? emp.getDepartment().getName() : "")
                        .avatarUrl(emp.getAvatarUrl())
                        .bio(emp.getBio())
                        .initials(getInitials(emp.getFirstName(), emp.getLastName()))
                        .build())
                .collect(Collectors.toList());
    }

    private String getInitials(String firstName, String lastName) {
        String f = (firstName != null && !firstName.isEmpty()) ? firstName.substring(0, 1).toUpperCase() : "";
        String l = (lastName != null && !lastName.isEmpty()) ? lastName.substring(0, 1).toUpperCase() : "";
        return f + l;
    }
}
