package com.aurora.aurora_backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record SendMessageRequestDTO( 
    @NotNull
    Long conversationId,

    @NotBlank
    String content
){
}
