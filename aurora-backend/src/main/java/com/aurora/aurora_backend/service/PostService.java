package com.aurora.aurora_backend.service;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

// import com.aurora.aurora_backend.dto.CreatePostRequest;
import com.aurora.aurora_backend.dto.PostResponseDTO;
import com.aurora.aurora_backend.entity.Follow;
import com.aurora.aurora_backend.entity.Like;
import com.aurora.aurora_backend.entity.Post;
import com.aurora.aurora_backend.entity.User;
import com.aurora.aurora_backend.redis.ExploreCacheEntry;
import com.aurora.aurora_backend.repository.FollowRepository;
import com.aurora.aurora_backend.repository.PostRepository;
import com.aurora.aurora_backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PostService {
        private final CloudinaryService cloudinaryService;
        private final PostRepository postRepository;
        private final UserRepository userRepository;
        private final FollowRepository followRepository;
        private final RedisTemplate<String, ExploreCacheEntry> exploreCacheRedisTemplate;

        public PostResponseDTO createPost(String content, MultipartFile image) {

                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
                String email = authentication.getName();

                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                if ((content == null || content.isBlank())
                                && (image == null || image.isEmpty())) {

                        throw new RuntimeException("Post must contain text or image");
                }

                String imageUrl = null;

                try {
                        if (image != null && !image.isEmpty()) {
                                imageUrl = cloudinaryService.uploadImage(image);
                        }
                } catch (Exception e) {
                        throw new RuntimeException("Failed to upload image", e);
                }

                Post post = Post.builder()
                                .content(content)
                                .imageUrl(imageUrl)
                                .author(user)
                                .build();

                Post savedPost = postRepository.save(post);
                clearExploreCache();

                return mapToPostResponse(savedPost, user);
        }

        public Page<PostResponseDTO> getAllPosts(int page, int size) {

                String cacheKey = "explore:page:" + page + ":size:" + size;

                ExploreCacheEntry cached = exploreCacheRedisTemplate
                                .opsForValue()
                                .get(cacheKey);

                Pageable pageable = PageRequest.of(page, size);

                if (cached != null) {
                        System.out.println("EXPLORE CACHE HIT");
                        return new PageImpl<>(
                                        cached.getPosts(),
                                        pageable,
                                        cached.getTotalElements());
                }

                System.out.println("EXPLORE CACHE MISS");

                Authentication authentication = SecurityContextHolder
                                .getContext()
                                .getAuthentication();

                User currentUser = (User) authentication.getPrincipal();

                Page<Post> posts = postRepository
                                .findAllByOrderByCreatedAtDesc(pageable);

                Page<PostResponseDTO> response = posts.map(
                                post -> mapToPostResponse(post, currentUser));

                ExploreCacheEntry entry = new ExploreCacheEntry(
                                response.getContent(),
                                response.getTotalElements(),
                                response.getTotalPages(),
                                response.isLast());

                exploreCacheRedisTemplate
                                .opsForValue()
                                .set(cacheKey, entry, Duration.ofSeconds(60));

                return response;
        }

        public Page<PostResponseDTO> getUserPosts(String username, int page, int size) {

                Authentication authentication = SecurityContextHolder
                                .getContext()
                                .getAuthentication();

                User currentUser = (User) authentication.getPrincipal();

                User user = userRepository
                                .findByUsername(username)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                Pageable pageable = PageRequest.of(page, size);

                Page<Post> posts = postRepository
                                .findByAuthorOrderByCreatedAtDesc(user, pageable);

                return posts.map(post -> mapToPostResponse(post, currentUser));
        }

        public void deletePost(Long postId) {
                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

                User currentUser = (User) authentication.getPrincipal();

                Post post = postRepository.findById(postId).orElseThrow(() -> new RuntimeException("Post not found"));

                if (!post.getAuthor().getId().equals(currentUser.getId())) {
                        throw new RuntimeException("You can delete only your own posts");
                }
                postRepository.delete(post);
                clearExploreCache();

        }

        public PostResponseDTO getPostById(Long postId) {
                Authentication authentication = SecurityContextHolder
                                .getContext()
                                .getAuthentication();

                User currentUser = (User) authentication.getPrincipal();

                Post post = postRepository
                                .findById(postId)
                                .orElseThrow(() -> new RuntimeException("Post not found"));

                return mapToPostResponse(post, currentUser);
        }

        public Page<PostResponseDTO> getFeed(int page, int size) {
                Authentication authentication = SecurityContextHolder
                                .getContext()
                                .getAuthentication();

                User currUser = (User) authentication.getPrincipal();

                Pageable pageable = PageRequest.of(page, size);
                List<User> authors = followRepository.findByFollower(currUser)
                                .stream()
                                .map(Follow::getFollowing)
                                .toList();

                Page<Post> posts;
                if (authors.isEmpty()) {
                        posts = postRepository.findAllByOrderByCreatedAtDesc(pageable);
                } else {
                        List<User> feedAuthors = new ArrayList<>(authors);
                        feedAuthors.add(currUser);

                        posts = postRepository.findByAuthorInOrderByCreatedAtDesc(feedAuthors, pageable);
                }

                return posts.map(post -> mapToPostResponse(post, currUser));
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
                                post.getImageUrl(),
                                post.getAuthor().getDisplayUsername(),
                                post.getAuthor().getProfilePictureUrl(),
                                post.getCreatedAt(),
                                likeCount,
                                likedByCurrentUser,
                                commentCount);
        }

        private void clearExploreCache() {

                var keys = exploreCacheRedisTemplate.keys("explore:*");

                if (keys != null && !keys.isEmpty()) {
                        exploreCacheRedisTemplate.delete(keys);
                }
        }
}
