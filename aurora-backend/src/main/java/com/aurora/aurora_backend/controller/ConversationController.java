package com.aurora.aurora_backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aurora.aurora_backend.dto.ConversationListItemDTO;
import com.aurora.aurora_backend.dto.ConversationResponseDTO;
import com.aurora.aurora_backend.dto.MessageResponseDTO;
import com.aurora.aurora_backend.service.ConversationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/conversations")
@RequiredArgsConstructor
public class ConversationController {

    private final ConversationService conversationService;

    @PostMapping("/{username}")
    public ConversationResponseDTO createOrGetConversation(@PathVariable String username) {
        return conversationService.createOrGetConversation(username);
    }

    @GetMapping
    public List<ConversationListItemDTO> getConversations() {
        return conversationService.getConversations();
    }

    @GetMapping("/{conversationId}/messages")
    public List<MessageResponseDTO> getMessages(
            @PathVariable Long conversationId) {
        return conversationService.getMessages(conversationId);
    }

}
