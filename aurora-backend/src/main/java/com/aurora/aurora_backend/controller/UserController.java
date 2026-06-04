package com.aurora.aurora_backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aurora.aurora_backend.dto.PostResponseDTO;
import com.aurora.aurora_backend.dto.UserProfileResponse;
import com.aurora.aurora_backend.service.PostService;
import com.aurora.aurora_backend.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final PostService postService;

    @GetMapping("/{username}")
    public ResponseEntity<UserProfileResponse> getProfile(@PathVariable String username) {
        return ResponseEntity.ok(userService.getProfile(username));
    }

    @GetMapping("/{username}/posts")
    public ResponseEntity<List<PostResponseDTO>> getUserPosts(
            @PathVariable String username) {
        return ResponseEntity.ok(
                postService.getUserPosts(username));
    }
}
