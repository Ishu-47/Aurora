package com.aurora.aurora_backend.service;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.aurora.aurora_backend.dto.UserProfileResponse;
import com.aurora.aurora_backend.entity.User;
import com.aurora.aurora_backend.repository.FollowRepository;
import com.aurora.aurora_backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final FollowRepository followRepository;

    public UserProfileResponse getProfile(String username) {

        User profileUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        long followerCount = followRepository.countByFollowing(profileUser);

        long followingCount = followRepository.countByFollower(profileUser);

        boolean followedByCurrentUser = false;

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        User currentUser = userRepository
                .findByEmail(email)
                .orElse(null);

        if (currentUser != null) {
            followedByCurrentUser = followRepository.existsByFollowerAndFollowing(currentUser, profileUser);
        }

        return UserProfileResponse.builder()
                .id(profileUser.getId())
                .username(profileUser.getDisplayUsername())
                .bio(profileUser.getBio())
                .profilePictureUrl(profileUser.getProfilePictureUrl())
                .createdAt(profileUser.getCreatedAt())
                .followerCount(followerCount)
                .followingCount(followingCount)
                .followedByCurrentUser(followedByCurrentUser)
                .build();
    }
}
