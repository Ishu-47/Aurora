package com.aurora.aurora_backend.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.aurora.aurora_backend.dto.MessageResponseDTO;
import com.aurora.aurora_backend.dto.SendMessageRequestDTO;
import com.aurora.aurora_backend.entity.Conversation;
import com.aurora.aurora_backend.entity.ConversationParticipant;
import com.aurora.aurora_backend.entity.User;
import com.aurora.aurora_backend.repository.ConversationParticipantRepository;
import com.aurora.aurora_backend.repository.ConversationRepository;
import com.aurora.aurora_backend.repository.UserRepository;
import com.aurora.aurora_backend.service.ConversationService;

import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
public class ChatWebSocketController {

    private final SimpMessagingTemplate messagingTemplate;
    private final UserRepository userRepository;
    private final ConversationRepository conversationRepository;
    private final ConversationParticipantRepository participantRepository;
    private final ConversationService conversationService;

    @MessageMapping("/chat.send")
    public void sendMessage(SendMessageRequestDTO request, Principal principal) {
        User sender = userRepository.findByEmail(principal.getName()).orElseThrow();

        MessageResponseDTO message = conversationService.createMessage(sender, request.conversationId(),
                request.content());
        Conversation conversation = conversationRepository.findById(request.conversationId()).orElseThrow();

        List<ConversationParticipant> participants = participantRepository.findByConversationWithUser(conversation);
        for (ConversationParticipant participant : participants) {
            if (participant.getUser()
                    .getId()
                    .equals(sender.getId())) {
                continue;
            }
            messagingTemplate.convertAndSendToUser(
                    participant
                            .getUser()
                            .getEmail(),
                    "/queue/messages",
                    message);
            System.out.println(
                    "Sending to: "
                            + participant.getUser().getEmail());
        }
        System.out.println("CHAT MESSAGE RECEIVED");

    }
}
