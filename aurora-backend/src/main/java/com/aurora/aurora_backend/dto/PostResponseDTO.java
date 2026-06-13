package com.aurora.aurora_backend.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class PostResponseDTO {
    private Long id;
    private String content;
    private String imageUrl;
    private String username;
    private String authorProfilePictureUrl;
    private LocalDateTime createdAt;
    private long likeCount;
    private boolean likedByCurrentUser;
    private long commentCount;
}
