package com.RH.PFA.event;

import com.RH.PFA.entity.Leave;
import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class LeaveStatusChangedEvent extends ApplicationEvent {
    private final Leave leave;

    public LeaveStatusChangedEvent(Object source, Leave leave) {
        super(source);
        this.leave = leave;
    }
}
