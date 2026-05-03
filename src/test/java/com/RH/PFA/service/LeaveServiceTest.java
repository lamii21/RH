package com.RH.PFA.service;

import com.RH.PFA.dto.LeaveResponseDTO;
import com.RH.PFA.entity.Employee;
import com.RH.PFA.entity.Leave;
import com.RH.PFA.entity.LeaveStatus;
import com.RH.PFA.repository.EmployeeRepository;
import com.RH.PFA.repository.LeaveRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.ApplicationEventPublisher;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LeaveServiceTest {

    @Mock
    private LeaveRepository leaveRepository;
    @Mock
    private EmployeeRepository employeeRepository;
    @Mock
    private SmartSchedulingService smartSchedulingService;
    @Mock
    private ApplicationEventPublisher eventPublisher;

    @InjectMocks
    private LeaveService leaveService;

    @Test
    void approveLeave_Success() {
        Employee employee = Employee.builder().id(1L).firstName("John").leaveBalance(30).build();
        Leave leave = Leave.builder()
                .id(100L)
                .employee(employee)
                .startDate(LocalDate.now().plusDays(1))
                .endDate(LocalDate.now().plusDays(5)) // 5 days
                .status(LeaveStatus.PENDING)
                .build();

        when(leaveRepository.findById(100L)).thenReturn(Optional.of(leave));
        when(smartSchedulingService.willCauseUnderstaffing(leave)).thenReturn(false);
        when(leaveRepository.save(any(Leave.class))).thenAnswer(i -> i.getArguments()[0]);

        LeaveResponseDTO result = leaveService.approveLeave(100L, "Have a nice trip!");

        assertEquals(LeaveStatus.APPROVED, result.getStatus());
        assertEquals(25, employee.getLeaveBalance());
        verify(employeeRepository).save(employee);
    }

    @Test
    void approveLeave_Understaffing_ThrowsException() {
        Leave leave = Leave.builder().id(100L).status(LeaveStatus.PENDING).build();
        when(leaveRepository.findById(100L)).thenReturn(Optional.of(leave));
        when(smartSchedulingService.willCauseUnderstaffing(leave)).thenReturn(true);

        assertThrows(IllegalStateException.class, () -> leaveService.approveLeave(100L, "Denied"));
        verify(leaveRepository, never()).save(any(Leave.class));
    }
    
    @Test
    void approveLeave_InsufficientBalance_ThrowsException() {
        Employee employee = Employee.builder().id(1L).leaveBalance(2).build();
        Leave leave = Leave.builder()
                .id(100L)
                .employee(employee)
                .startDate(LocalDate.now().plusDays(1))
                .endDate(LocalDate.now().plusDays(5)) // 5 days
                .status(LeaveStatus.PENDING)
                .build();

        when(leaveRepository.findById(100L)).thenReturn(Optional.of(leave));
        when(smartSchedulingService.willCauseUnderstaffing(leave)).thenReturn(false);

        assertThrows(IllegalStateException.class, () -> leaveService.approveLeave(100L, "Denied"));
    }
}
