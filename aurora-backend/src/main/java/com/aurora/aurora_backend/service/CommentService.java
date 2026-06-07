package com.aurora.aurora_backend.service;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.aurora.aurora_backend.dto.CommentResponse;
import com.aurora.aurora_backend.dto.CreateCommentRequest;
import com.aurora.aurora_backend.entity.Comment;
import com.aurora.aurora_backend.entity.NotificationType;
import com.aurora.aurora_backend.entity.Post;
import com.aurora.aurora_backend.entity.User;
import com.aurora.aurora_backend.repository.CommentRepository;
import com.aurora.aurora_backend.repository.PostRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final NotificationService notificationService;

    public CommentResponse createComment(
            Long postId,
            CreateCommentRequest request
    ) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        User currentUser =
                (User) authentication.getPrincipal();

        Post post = postRepository
                .findById(postId)
                .orElseThrow(() ->
                        new RuntimeException("Post not found"));

        Comment comment = Comment.builder()
                .content(request.getContent())
                .author(currentUser)
                .post(post)
                .build();

        Comment savedComment =
                commentRepository.save(comment);

        notificationService.createNotification(
                post.getAuthor(),
                currentUser,
                NotificationType.COMMENT,
                currentUser.getDisplayUsername()
                        + " commented on your post"
        );

        return new CommentResponse(
                savedComment.getId(),
                savedComment.getContent(),
                savedComment.getAuthor().getDisplayUsername(),
                savedComment.getCreatedAt(),
                0
        );
    }

    public List<CommentResponse> getCommentsByPost(Long postId) {

        Post post = postRepository.findById(postId)
                .orElseThrow(() ->
                        new RuntimeException("Post not found"));

        return commentRepository
                .findByPostOrderByCreatedAtAsc(post)
                .stream()
                .map(comment -> new CommentResponse(
                        comment.getId(),
                        comment.getContent(),
                        comment.getAuthor().getDisplayUsername(),
                        comment.getCreatedAt(),
                        0
                ))
                .toList();
    }
}