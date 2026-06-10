package com.aurora.aurora_backend.dto;

import java.time.LocalDateTime;

public record ConversationListItemDTO(Long conversationId, String username, String profilePictureUrl,
        String lastMessage, LocalDateTime lastMessageTime) {

}
