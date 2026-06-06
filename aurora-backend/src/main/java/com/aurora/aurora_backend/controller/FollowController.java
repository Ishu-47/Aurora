package com.aurora.aurora_backend.controller;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aurora.aurora_backend.dto.FollowResponse;
import com.aurora.aurora_backend.service.FollowService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class FollowController {
    
    private final FollowService followService;

    @PostMapping("/{username}/follow")
    public FollowResponse togglFollow(@PathVariable String username){
        return followService.toggleFollow(username);
    }
}
