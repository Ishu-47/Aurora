package com.aurora.aurora_backend.controller;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aurora.aurora_backend.dto.LikeResponse;
import com.aurora.aurora_backend.service.LikeService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class LikeController {
    
    private final LikeService likeService;

    @PostMapping("/{id}/like")
    public LikeResponse toogleLike(@PathVariable Long id){
        return likeService.toogleLike(id);
    }
}
