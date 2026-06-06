package com.aurora.aurora_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class FollowResponse {
    private boolean following;

    private long followerCount;
    private long followingCount;
}
