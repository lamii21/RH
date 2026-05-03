package com.RH.PFA.repository;

import com.RH.PFA.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    Optional<Employee> findByUserId(Long userId);
    List<Employee> findByDepartmentId(Long departmentId);
    long countByDepartmentId(Long departmentId);

    @Query("SELECT e.department.name, COUNT(e) FROM Employee e WHERE e.department IS NOT NULL GROUP BY e.department.name")
    List<Object[]> countEmployeesByDepartment();

    @org.springframework.data.jpa.repository.EntityGraph(attributePaths = {"user", "department"})
    org.springframework.data.domain.Page<Employee> findAll(org.springframework.data.domain.Pageable pageable);
}
