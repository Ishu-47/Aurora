package com.aurora.aurora_backend.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.aurora.aurora_backend.dto.AuthResponse;
import com.aurora.aurora_backend.dto.LoginRequest;
import com.aurora.aurora_backend.dto.RegisterRequest;
import com.aurora.aurora_backend.entity.User;
import com.aurora.aurora_backend.repository.UserRepository;
import com.aurora.aurora_backend.security.JwtService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public String register(RegisterRequest request){
        if(userRepository.existsByEmail(request.getEmail())){
            throw new RuntimeException("Email exists");
        }
        if(userRepository.existsByUsername(request.getUsername())){
            throw new RuntimeException("Username exists");
        }
        User user = new User();
        
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        userRepository.save(user);
        return "User register successfully";
    }

    public AuthResponse login(LoginRequest request){
        User user = userRepository.findByEmail(request.getEmail()).orElseThrow(() -> new RuntimeException("Invalid Credentials"));
        boolean matches = passwordEncoder.matches(request.getPassword(), user.getPassword());
        if(!matches){
            throw new RuntimeException("Invalid Credentials");
        }
        String token = jwtService.generateToken(user.getEmail());
        return new AuthResponse(token, user.getEmail(), user.getUsername());
    }

}
