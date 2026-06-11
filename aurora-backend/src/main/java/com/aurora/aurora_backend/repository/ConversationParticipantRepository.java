package com.aurora.aurora_backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.aurora.aurora_backend.entity.Conversation;
import com.aurora.aurora_backend.entity.ConversationParticipant;
import com.aurora.aurora_backend.entity.User;

public interface ConversationParticipantRepository extends JpaRepository<ConversationParticipant, Long> {
    List<ConversationParticipant> findByUser(User user);

    List<ConversationParticipant> findByConversation(Conversation conversation);

    boolean existsByConversationAndUser(Conversation conversation, User user);

    @Query("""
            SELECT cp
            FROM ConversationParticipant cp
            JOIN FETCH cp.user
            WHERE cp.conversation = :conversation
            """)
    List<ConversationParticipant> findByConversationWithUser(
            Conversation conversation);

    Optional<ConversationParticipant> findByConversationAndUser(Conversation conversation, User user);
    

}
