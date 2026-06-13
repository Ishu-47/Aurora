package com.aurora.aurora_backend.redis;

import java.io.Serializable;

import com.aurora.aurora_backend.dto.MessageResponseDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageEvent implements Serializable {
    private String recipientEmail;

    private MessageResponseDTO message;
}
