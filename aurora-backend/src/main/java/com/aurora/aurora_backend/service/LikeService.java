package com.aurora.aurora_backend.service;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.aurora.aurora_backend.dto.LikeResponse;
import com.aurora.aurora_backend.entity.Like;
import com.aurora.aurora_backend.entity.NotificationType;
import com.aurora.aurora_backend.entity.Post;
import com.aurora.aurora_backend.entity.User;
import com.aurora.aurora_backend.repository.LikeRepository;
import com.aurora.aurora_backend.repository.PostRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LikeService {

        private final LikeRepository likeRepository;
        private final PostRepository postRepository;
        private final NotificationService notificationService;

        public LikeResponse toogleLike(Long postId) {

                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

                User currentUser = (User) authentication.getPrincipal();

                Post post = postRepository.findById(postId)
                                .orElseThrow(() -> new RuntimeException("Post not found"));

                Like existingLike = likeRepository.findByUserAndPost(currentUser, post)
                                .orElse(null);

                boolean liked;

                if (existingLike != null) {

                        likeRepository.delete(existingLike);

                        liked = false;

                } else {

                        Like like = Like.builder()
                                        .user(currentUser)
                                        .post(post)
                                        .build();

                        likeRepository.save(like);

                        notificationService.createNotification(
                                        post.getAuthor(),
                                        currentUser,
                                        NotificationType.LIKE,
                                        currentUser.getDisplayUsername()
                                                        + " liked your post",
                                        post);

                        liked = true;
                }

                long likeCount = likeRepository.countByPost(post);

                return new LikeResponse(
                                liked,
                                likeCount);
        }
}