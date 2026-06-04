package com.aurora.aurora_backend.service;

import org.springframework.stereotype.Service;

import com.aurora.aurora_backend.dto.UserProfileResponse;
import com.aurora.aurora_backend.entity.User;
import com.aurora.aurora_backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public UserProfileResponse getProfile(String username){
        User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));

        return UserProfileResponse.builder()
               .id(user.getId())
               .username(user.getDisplayUsername())
               .bio(user.getBio())
               .profilePictureUrl(user.getProfilePictureUrl())
               .createdAt(user.getCreatedAt())
               .build();
    }
}
