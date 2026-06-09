package com.aurora.aurora_backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.aurora.aurora_backend.entity.Conversation;
import com.aurora.aurora_backend.entity.Message;

public interface MessageRepository extends JpaRepository<Message,Long>{
    List<Message> findByConversationOrderByCreatedAtAsc(Conversation conversation);
}
