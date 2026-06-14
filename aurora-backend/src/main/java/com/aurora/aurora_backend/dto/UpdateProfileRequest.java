package com.aurora.aurora_backend.dto;

import jakarta.validation.constraints.Size;

public record UpdateProfileRequest(
    @Size(max = 200)
    String bio
) {
} 