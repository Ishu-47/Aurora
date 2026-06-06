package com.aurora.aurora_backend.service;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.aurora.aurora_backend.dto.FollowResponse;
import com.aurora.aurora_backend.entity.Follow;
import com.aurora.aurora_backend.entity.User;
import com.aurora.aurora_backend.repository.FollowRepository;
import com.aurora.aurora_backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FollowService {
    private final FollowRepository followRepository;
    private final UserRepository userRepository;

    public FollowResponse toggleFollow(String username) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));
        User targetUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (targetUser.getId().equals(currentUser.getId())) {
            throw new RuntimeException("You can not follow yourself");
        }
        boolean following;

        Follow existingFollow = followRepository.findByFollowerAndFollowing(currentUser, targetUser).orElse(null);

        if (existingFollow != null) {
            followRepository.delete(existingFollow);
            following = false;
        } else {
            Follow follow = Follow.builder()
                    .follower(currentUser)
                    .following(targetUser)
                    .build();

            followRepository.save(follow);
            following = true;
        }
        long followerCount = followRepository.countByFollower(targetUser);
        long followingCount = followRepository.countByFollowing(targetUser);

        return new FollowResponse(following, followerCount, followingCount);

    }
}
