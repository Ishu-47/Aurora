package com.aurora.aurora_backend.service;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.aurora.aurora_backend.dto.FollowResponse;
import com.aurora.aurora_backend.entity.Follow;
import com.aurora.aurora_backend.entity.NotificationType;
import com.aurora.aurora_backend.entity.User;
import com.aurora.aurora_backend.repository.FollowRepository;
import com.aurora.aurora_backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FollowService {

    private final FollowRepository followRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public FollowResponse toggleFollow(String username) {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Authenticated user not found"));

        User targetUser = userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        if (targetUser.getId().equals(currentUser.getId())) {
            throw new RuntimeException("You can not follow yourself");
        }

        boolean following;

        Follow existingFollow =
                followRepository
                        .findByFollowerAndFollowing(currentUser, targetUser)
                        .orElse(null);

        if (existingFollow != null) {

            followRepository.delete(existingFollow);

            following = false;

        } else {

            Follow follow = Follow.builder()
                    .follower(currentUser)
                    .following(targetUser)
                    .build();

            followRepository.save(follow);

            notificationService.createNotification(
                    targetUser,
                    currentUser,
                    NotificationType.FOLLOW,
                    currentUser.getDisplayUsername() + " followed you"
            );

            following = true;
        }

        long followingCount =
                followRepository.countByFollowing(targetUser);

        long followerCount =
                followRepository.countByFollower(targetUser);

        return new FollowResponse(
                following,
                followerCount,
                followingCount
        );
    }
}