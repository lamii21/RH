package com.RH.PFA.event;

import com.RH.PFA.entity.Employee;
import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class EmployeeCreatedEvent extends ApplicationEvent {
    private final Employee employee;

    public EmployeeCreatedEvent(Object source, Employee employee) {
        super(source);
        this.employee = employee;
    }
}
