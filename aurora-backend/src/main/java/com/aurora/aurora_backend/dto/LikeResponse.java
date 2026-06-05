package com.aurora.aurora_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class LikeResponse {
    
    private boolean liked;
    private long likeCount;
}
