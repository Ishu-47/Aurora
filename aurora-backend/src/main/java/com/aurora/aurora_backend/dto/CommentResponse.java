package com.aurora.aurora_backend.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CommentResponse {

    private Long id;

    private String content;

    private String username;

    private LocalDateTime createdAt;

    private long likeCount;
}