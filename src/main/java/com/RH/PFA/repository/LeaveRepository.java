package com.RH.PFA.repository;

import com.RH.PFA.entity.Leave;
import com.RH.PFA.entity.LeaveStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface LeaveRepository extends JpaRepository<Leave, Long> {
    List<Leave> findByEmployeeId(Long employeeId);
    Page<Leave> findAll(Pageable pageable);
    long countByStatus(LeaveStatus status);

    @Query("SELECT l FROM Leave l WHERE l.status = :status " +
           "AND l.employee.department.id = :departmentId " +
           "AND l.startDate <= :endDate AND l.endDate >= :startDate")
    List<Leave> findOverlappingApprovedLeaves(
            @Param("status") LeaveStatus status,
            @Param("departmentId") Long departmentId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);
}
