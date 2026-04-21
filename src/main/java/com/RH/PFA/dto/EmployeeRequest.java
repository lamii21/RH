package com.RH.PFA.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.RH.PFA.entity.Role;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeRequest {
    private String email;
    private String password;
    private Role role; // Added strictly if admin creates
    private String firstName;
    private String lastName;
    private String phone;
    private String jobTitle;
    private Long departmentId;
}
