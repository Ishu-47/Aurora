package com.aurora.aurora_backend.service;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.aurora.aurora_backend.dto.CreatePostRequest;
import com.aurora.aurora_backend.dto.PostResponseDTO;
import com.aurora.aurora_backend.entity.Post;
import com.aurora.aurora_backend.entity.User;
import com.aurora.aurora_backend.repository.PostRepository;
import com.aurora.aurora_backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PostService {
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    public PostResponseDTO createPost(CreatePostRequest request){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        Post post = Post.builder()
                    .content(request.getContent())
                    .author(user)
                    .build();

        Post savedPost = postRepository.save(post);
        return new PostResponseDTO(savedPost.getId(), savedPost.getContent(), savedPost.getAuthor().getDisplayUsername(), savedPost.getCreatedAt());
    }
    public List<PostResponseDTO> getAllPosts(){
        List<Post> posts = postRepository.findAllByOrderByCreatedAtDesc();

        return posts.stream()
               .map(post -> new PostResponseDTO(post.getId(), post.getContent(), post.getAuthor().getDisplayUsername(), post.getCreatedAt())).toList();
    }
}
