package com.aurora.aurora_backend.service;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.aurora.aurora_backend.dto.NotificationEventDTO;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotificationWebsocketService {
    private final SimpMessagingTemplate messagingTemplate;

    public void sendNotification(String recipientEmail, NotificationEventDTO event){
        messagingTemplate.convertAndSendToUser(recipientEmail, "/queue/notificaitons", event);
    }
}
