package com.aurora.aurora_backend.dto;

import java.time.LocalDateTime;

import com.aurora.aurora_backend.entity.NotificationType;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class NotificationResponseDTO {

    private Long id;
    private String senderUsername;
    private NotificationType type;
    private String message;
    private Long postId;
    private boolean read;
    private LocalDateTime createdAt;
}
