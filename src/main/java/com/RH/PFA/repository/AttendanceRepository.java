package com.RH.PFA.repository;

import com.RH.PFA.entity.Attendance;
import com.RH.PFA.entity.AttendanceStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    List<Attendance> findByEmployeeId(Long employeeId);
    Optional<Attendance> findByEmployeeIdAndDate(Long employeeId, LocalDate date);
    Page<Attendance> findAll(Pageable pageable);
    long countByDateAndStatus(LocalDate date, AttendanceStatus status);
    List<Attendance> findByDateBetween(LocalDate start, LocalDate end);
}
