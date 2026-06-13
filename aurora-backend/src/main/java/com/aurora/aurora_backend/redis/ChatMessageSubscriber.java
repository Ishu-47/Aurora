package com.aurora.aurora_backend.redis;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ChatMessageSubscriber {

    private final SimpMessagingTemplate messagingTemplate;

    public void receive(ChatMessageEvent event) {

        System.out.println("Subscriber received event");

        messagingTemplate.convertAndSendToUser(
                event.getRecipientEmail(),
                "/queue/messages",
                event.getMessage());

        System.out.println(
                "Redis chat event delivered to "
                        + event.getRecipientEmail());
    }
}