package com.aurora.aurora_backend.dto;

import java.time.LocalDateTime;

public record MessageResponseDTO(
        Long id,
        Long senderId,
        String senderUsername,
        String content,
        LocalDateTime createdAt
) {
}