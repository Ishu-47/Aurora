package com.aurora.aurora_backend.controller;

import java.util.List;

import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.aurora.aurora_backend.dto.CommentResponse;
import com.aurora.aurora_backend.dto.CreateCommentRequest;
import com.aurora.aurora_backend.service.CommentService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
@Validated
public class CommentController {

    private final CommentService commentService;

    @PostMapping("/{postId}/comments")
    public CommentResponse createComment(
            @PathVariable Long postId,
            @Valid @RequestBody CreateCommentRequest request) {
        return commentService.createComment(postId, request);
    }

    @GetMapping("/{postId}/comments")
    public List<CommentResponse> getComments(
            @PathVariable Long postId) {
        return commentService.getCommentsByPost(postId);
    }
}