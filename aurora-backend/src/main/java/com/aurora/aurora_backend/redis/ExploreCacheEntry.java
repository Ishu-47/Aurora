package com.aurora.aurora_backend.redis;

import java.io.Serializable;
import java.util.List;

import com.aurora.aurora_backend.dto.PostResponseDTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ExploreCacheEntry implements Serializable {

    private List<PostResponseDTO> posts;

    private long totalElements;

    private int totalPages;

    private boolean last;
}