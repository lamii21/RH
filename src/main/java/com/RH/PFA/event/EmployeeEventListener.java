package com.RH.PFA.event;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class EmployeeEventListener {

    @Async
    @EventListener
    public void handleEmployeeCreatedEvent(EmployeeCreatedEvent event) {
        log.info("Asynchronously sending welcome email to new employee: {}", event.getEmployee().getUser().getEmail());
        // Here we would integrate with an Email Service (e.g. JavaMailSender)
        // or a third-party API like SendGrid to send the email.
        try {
            Thread.sleep(1000); // Simulate network delay
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        log.info("Welcome email sent successfully.");
    }
}
