package com.aurora.aurora_backend.service;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.user.SimpUser;
import org.springframework.messaging.simp.user.SimpUserRegistry;
import org.springframework.stereotype.Service;

import com.aurora.aurora_backend.dto.NotificationEventDTO;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotificationWebsocketService {
        private final SimpMessagingTemplate messagingTemplate;
        private final SimpUserRegistry simpUserRegistry;

        public void sendNotification(
                        String recipientEmail,
                        NotificationEventDTO event) {

                System.out.println(
                                "Sending notification to: "
                                                + recipientEmail);
                System.out.println(
                                "Connected users: "
                                                + simpUserRegistry.getUsers());

                System.out.println(
                                "Unread count sent: "
                                                + event.getUnreadCount());

                for (SimpUser user : simpUserRegistry.getUsers()) {
                        System.out.println(
                                        "Connected user: "
                                                        + user.getName());
                }

                messagingTemplate.convertAndSendToUser(
                                recipientEmail,
                                "/queue/notifications",
                                event);
        }
}
