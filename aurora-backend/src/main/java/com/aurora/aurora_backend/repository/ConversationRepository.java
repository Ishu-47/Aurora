package com.aurora.aurora_backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.aurora.aurora_backend.entity.Conversation;

public interface ConversationRepository extends JpaRepository<Conversation, Long>{

    Optional<Conversation> findByConversationKey(String conversationKey);
}
