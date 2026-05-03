package com.RH.PFA.controller;

import com.RH.PFA.dto.LeaveResponseDTO;
import com.RH.PFA.entity.LeaveStatus;
import com.RH.PFA.security.JwtService;
import com.RH.PFA.service.LeaveService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(LeaveController.class)
@AutoConfigureMockMvc(addFilters = false) // Disable security filters for simple controller testing
class LeaveControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private LeaveService leaveService;

    @MockBean
    private JwtService jwtService; // Required for Security context even if filters disabled

    @Test
    @WithMockUser(roles = "ADMIN")
    void approveLeave_ReturnsSuccess() throws Exception {
        LeaveResponseDTO response = LeaveResponseDTO.builder()
                .id(1L)
                .status(LeaveStatus.APPROVED)
                .build();

        when(leaveService.approveLeave(anyLong(), anyString())).thenReturn(response);

        mockMvc.perform(put("/api/v1/leaves/1/approve")
                .param("comment", "Approved")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("APPROVED"));
    }
}
