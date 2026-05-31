package com.aurora.aurora_backend.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.aurora.aurora_backend.dto.RegisterRequest;
import com.aurora.aurora_backend.entity.User;
import com.aurora.aurora_backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public String register(RegisterRequest request){
        if(userRepository.existsByEmail(request.getEmail())){
            throw new RuntimeException();
        }
        if(userRepository.existsByUsername(request.getUsername())){
            throw new RuntimeException();
        }
        User user = new User();
        
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        userRepository.save(user);
        return "User register successfully";
    }

}
