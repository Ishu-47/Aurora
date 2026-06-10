package com.aurora.aurora_backend.service;

import java.util.*;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.aurora.aurora_backend.dto.ConversationListItemDTO;
import com.aurora.aurora_backend.dto.ConversationResponseDTO;
import com.aurora.aurora_backend.entity.Conversation;
import com.aurora.aurora_backend.entity.ConversationParticipant;
import com.aurora.aurora_backend.entity.Message;
import com.aurora.aurora_backend.entity.User;
import com.aurora.aurora_backend.repository.ConversationParticipantRepository;
import com.aurora.aurora_backend.repository.ConversationRepository;
import com.aurora.aurora_backend.repository.MessageRepository;
import com.aurora.aurora_backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ConversationService {

    private final UserRepository userRepository;
    private final ConversationRepository conversationRepository;
    private final ConversationParticipantRepository participantRepository;
    private final MessageRepository messageRepository;

    public ConversationResponseDTO createOrGetConversation(String targetUsername) {
        String currentEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        User targetUser = userRepository.findByUsername(targetUsername)
                .orElseThrow(() -> new RuntimeException("Target user not found"));

        if (currentUser.getId().equals(targetUser.getId())) {
            throw new RuntimeException("Cannot create conversation with yourself");
        }
        String conversationKey = buildConversationKey(currentUser.getId(), targetUser.getId());
        Conversation conversation = conversationRepository.findByConversationKey(conversationKey)
                .orElseGet(() -> createConversation(conversationKey, currentUser, targetUser));
        return new ConversationResponseDTO(conversation.getId());

    }

    private String buildConversationKey(Long user1Id, Long user2Id) {
        long first = Math.min(user1Id, user2Id);
        long second = Math.max(user1Id, user2Id);
        return first + "_" + second;
    }

    private Conversation createConversation(String conversationKey, User user1, User user2) {
        Conversation conversation = new Conversation();
        conversation.setConversationKey(conversationKey);
        conversation = conversationRepository.save(conversation);

        ConversationParticipant p1 = new ConversationParticipant();
        p1.setConversation(conversation);
        p1.setUser(user1);
        ConversationParticipant p2 = new ConversationParticipant();
        p2.setConversation(conversation);
        p2.setUser(user2);

        participantRepository.save(p1);
        participantRepository.save(p2);

        return conversation;
    }

    public List<ConversationListItemDTO> getConversations() {
        String currentEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        List<ConversationParticipant> participations = participantRepository.findByUser(currentUser);

        return participations.stream().map(participation -> {
            Conversation conversation = participation.getConversation();
            User otherUser = participantRepository.findByConversation(conversation).stream()
                    .map(ConversationParticipant::getUser).filter(user -> !user.getId().equals(currentUser.getId()))
                    .findFirst().orElse(null);
            Message lastMessage = messageRepository.findTopByConversationOrderByCreatedAtDesc(conversation)
                    .orElse(null);

            return new ConversationListItemDTO(conversation.getId(), otherUser != null
                    ? otherUser.getDisplayUsername()
                    : "Unknown User",
                    otherUser != null ? otherUser.getProfilePictureUrl() : null,
                    lastMessage != null ? lastMessage.getContent() : null,
                    lastMessage != null ? lastMessage.getCreatedAt() : null);
        }).sorted(Comparator.comparing(ConversationListItemDTO::lastMessageTime,
                Comparator.nullsLast(Comparator.reverseOrder()))).toList();
    }

    
}
