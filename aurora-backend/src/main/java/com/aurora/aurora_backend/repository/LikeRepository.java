package com.aurora.aurora_backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.aurora.aurora_backend.entity.Like;
import com.aurora.aurora_backend.entity.Post;
import com.aurora.aurora_backend.entity.User;

public interface LikeRepository extends JpaRepository<Like,Long> {
    
    Optional<Like> findByUserAndPost(User user, Post post);

    long countByPost(Post post);
}
