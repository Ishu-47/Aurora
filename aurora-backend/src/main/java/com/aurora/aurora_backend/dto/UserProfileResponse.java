package com.aurora.aurora_backend.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserProfileResponse {
    
    private Long id;

    private String username;

    private String bio;

    private String profilePictureUrl;

    private LocalDateTime createdAt;

    private long followerCount;

    private long followingCount;

    private boolean followedByCurrentUser;
}
