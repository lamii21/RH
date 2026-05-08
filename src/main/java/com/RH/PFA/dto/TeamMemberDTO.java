package com.RH.PFA.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TeamMemberDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String jobTitle;
    private String departmentName;
    private String avatarUrl;
    private String bio;
    private String initials;
}
