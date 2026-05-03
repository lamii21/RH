package com.RH.PFA.event;

import com.RH.PFA.dto.LeaveResponseDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class LeaveEventListener {

    private final SimpMessagingTemplate messagingTemplate;

    @EventListener
    public void handleLeaveStatusChange(LeaveStatusChangedEvent event) {
        log.info("Leave status changed event received for leave ID: {}", event.getLeave().getId());
        
        LeaveResponseDTO dto = LeaveResponseDTO.builder()
                .id(event.getLeave().getId())
                .employeeId(event.getLeave().getEmployee().getId())
                .employeeName(event.getLeave().getEmployee().getFirstName() + " " + event.getLeave().getEmployee().getLastName())
                .startDate(event.getLeave().getStartDate())
                .endDate(event.getLeave().getEndDate())
                .status(event.getLeave().getStatus())
                .type(event.getLeave().getType())
                .reason(event.getLeave().getReason())
                .managerComment(event.getLeave().getManagerComment())
                .build();

        // Broadcast to a specific topic
        messagingTemplate.convertAndSend("/topic/notifications", dto);
    }
}
