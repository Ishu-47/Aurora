package com.aurora.aurora_backend.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.aurora.aurora_backend.dto.CreatePostRequest;
import com.aurora.aurora_backend.dto.PostResponseDTO;
import com.aurora.aurora_backend.entity.Follow;
import com.aurora.aurora_backend.entity.Like;
import com.aurora.aurora_backend.entity.Post;
import com.aurora.aurora_backend.entity.User;
import com.aurora.aurora_backend.repository.FollowRepository;
import com.aurora.aurora_backend.repository.PostRepository;
import com.aurora.aurora_backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PostService {
        private final PostRepository postRepository;
        private final UserRepository userRepository;
        private final FollowRepository followRepository;

        public PostResponseDTO createPost(CreatePostRequest request) {
                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
                String email = authentication.getName();
                User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
                Post post = Post.builder()
                                .content(request.getContent())
                                .author(user)
                                .build();

                Post savedPost = postRepository.save(post);
                return mapToPostResponse(savedPost, user);
        }

        public List<PostResponseDTO> getAllPosts() {

                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

                User currentUser = (User) authentication.getPrincipal();

                List<Post> posts = postRepository.findAllByOrderByCreatedAtDesc();

                return posts.stream()
                                .map(post -> mapToPostResponse(post, currentUser))
                                .toList();
        }

        public List<PostResponseDTO> getUserPosts(String username) {

                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

                User currentUser = (User) authentication.getPrincipal();

                User user = userRepository
                                .findByUsername(username)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                return postRepository
                                .findByAuthorOrderByCreatedAtDesc(user)
                                .stream()
                                .map(post -> mapToPostResponse(post, currentUser))
                                .toList();
        }

        public void deletePost(Long postId) {
                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

                User currentUser = (User) authentication.getPrincipal();

                Post post = postRepository.findById(postId).orElseThrow(() -> new RuntimeException("Post not found"));

                if (!post.getAuthor().getId().equals(currentUser.getId())) {
                        throw new RuntimeException("You can delete only your own posts");
                }
                postRepository.delete(post);

        }

        public List<PostResponseDTO> getFeed() {
                Authentication authentication = SecurityContextHolder
                                .getContext()
                                .getAuthentication();

                User currUser = (User) authentication.getPrincipal();

                List<User> authors = followRepository.findByFollower(currUser)
                                .stream()
                                .map(Follow::getFollowing)
                                .toList();

                List<Post> posts;

                if (authors.isEmpty()) {
                        posts = postRepository.findAllByOrderByCreatedAtDesc();
                } else {
                        List<User> feedAuthors = new ArrayList<>(authors);
                        feedAuthors.add(currUser);

                        posts = postRepository.findByAuthorInOrderByCreatedAtDesc(feedAuthors);
                }

                return posts.stream().map(post -> mapToPostResponse(post, currUser)).toList();
        }

        private PostResponseDTO mapToPostResponse(Post post, User currentUser) {
                long likeCount = post.getLikes().size();
                long commentCount = post.getComments().size();

                boolean likedByCurrentUser = post.getLikes()
                                .stream()
                                .map(Like::getUser)
                                .map(User::getId)
                                .anyMatch(id -> id.equals(currentUser.getId()));

                return new PostResponseDTO(
                                post.getId(),
                                post.getContent(),
                                post.getAuthor().getDisplayUsername(),
                                post.getCreatedAt(),
                                likeCount,
                                likedByCurrentUser,
                                commentCount);
        }
}
