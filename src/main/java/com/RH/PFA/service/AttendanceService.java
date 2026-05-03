package com.RH.PFA.service;

import com.RH.PFA.dto.AttendanceDTO;
import com.RH.PFA.entity.Attendance;
import com.RH.PFA.entity.AttendanceStatus;
import com.RH.PFA.entity.Employee;
import com.RH.PFA.exception.ResourceNotFoundException;
import com.RH.PFA.repository.AttendanceRepository;
import com.RH.PFA.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final EmployeeRepository employeeRepository;

    @Transactional
    public AttendanceDTO checkIn(Long employeeId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));

        LocalDate today = LocalDate.now();
        Optional<Attendance> existingAttendance = attendanceRepository.findByEmployeeIdAndDate(employeeId, today);
        
        if (existingAttendance.isPresent()) {
            throw new IllegalStateException("Already checked in today");
        }

        LocalDateTime now = LocalDateTime.now();
        AttendanceStatus status = (now.getHour() > 9) ? AttendanceStatus.LATE : AttendanceStatus.PRESENT;

        Attendance attendance = Attendance.builder()
                .employee(employee)
                .date(today)
                .checkIn(now)
                .status(status)
                .build();

        return mapToDTO(attendanceRepository.save(attendance));
    }

    @Transactional
    public AttendanceDTO checkOut(Long employeeId) {
        LocalDate today = LocalDate.now();
        Attendance attendance = attendanceRepository.findByEmployeeIdAndDate(employeeId, today)
                .orElseThrow(() -> new ResourceNotFoundException("No check-in found for today"));

        if (attendance.getCheckOut() != null) {
            throw new IllegalStateException("Already checked out today");
        }

        LocalDateTime now = LocalDateTime.now();
        attendance.setCheckOut(now);

        Duration duration = Duration.between(attendance.getCheckIn(), now);
        double hours = duration.toMinutes() / 60.0;
        attendance.setWorkHours(Math.round(hours * 100.0) / 100.0);

        if (hours < 4 && attendance.getStatus() != AttendanceStatus.LATE) {
            attendance.setStatus(AttendanceStatus.HALF_DAY);
        }

        return mapToDTO(attendanceRepository.save(attendance));
    }

    public List<AttendanceDTO> getEmployeeAttendance(Long employeeId) {
        return attendanceRepository.findByEmployeeId(employeeId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public Page<AttendanceDTO> getAllAttendance(Pageable pageable) {
        return attendanceRepository.findAll(pageable).map(this::mapToDTO);
    }

    private AttendanceDTO mapToDTO(Attendance attendance) {
        return AttendanceDTO.builder()
                .id(attendance.getId())
                .employeeId(attendance.getEmployee().getId())
                .employeeName(attendance.getEmployee().getFirstName() + " " + attendance.getEmployee().getLastName())
                .date(attendance.getDate())
                .checkIn(attendance.getCheckIn())
                .checkOut(attendance.getCheckOut())
                .workHours(attendance.getWorkHours())
                .status(attendance.getStatus())
                .build();
    }
}
