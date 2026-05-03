package com.RH.PFA.service;

import com.RH.PFA.dto.EmployeeDTO;
import com.RH.PFA.dto.EmployeeRequest;
import com.RH.PFA.entity.Employee;
import com.RH.PFA.entity.Role;
import com.RH.PFA.entity.User;
import com.RH.PFA.repository.DepartmentRepository;
import com.RH.PFA.repository.EmployeeRepository;
import com.RH.PFA.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EmployeeServiceTest {

    @Mock
    private EmployeeRepository employeeRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private DepartmentRepository departmentRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private ApplicationEventPublisher eventPublisher;

    @InjectMocks
    private EmployeeService employeeService;

    private EmployeeRequest request;

    @BeforeEach
    void setUp() {
        request = new EmployeeRequest();
        request.setFirstName("John");
        request.setLastName("Doe");
        request.setEmail("john.doe@example.com");
        request.setPassword("password123");
        request.setRole(Role.EMPLOYEE);
    }

    @Test
    void createEmployee_Success() {
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(anyString())).thenReturn("hashed_password");
        
        Employee savedEmployee = Employee.builder()
                .id(1L)
                .firstName("John")
                .lastName("Doe")
                .user(User.builder().email("john.doe@example.com").role(Role.EMPLOYEE).build())
                .leaveBalance(30)
                .build();
        
        when(employeeRepository.save(any(Employee.class))).thenReturn(savedEmployee);

        EmployeeDTO result = employeeService.createEmployee(request);

        assertNotNull(result);
        assertEquals("John", result.getFirstName());
        assertEquals("john.doe@example.com", result.getEmail());
        verify(employeeRepository).save(any(Employee.class));
        verify(eventPublisher).publishEvent(any());
    }

    @Test
    void createEmployee_DuplicateEmail_ThrowsException() {
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(new User()));

        assertThrows(IllegalArgumentException.class, () -> employeeService.createEmployee(request));
        verify(employeeRepository, never()).save(any(Employee.class));
    }
}
