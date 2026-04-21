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
public class EmployeeDTO {
    private Long id;
    private String email;
    private Role role;
    private String firstName;
    private String lastName;
    private String phone;
    private String jobTitle;
    private Long departmentId;
    private String departmentName;
    private Integer leaveBalance;
}
