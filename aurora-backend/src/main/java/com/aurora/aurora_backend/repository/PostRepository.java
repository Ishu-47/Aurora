package com.aurora.aurora_backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.aurora.aurora_backend.entity.Post;
import com.aurora.aurora_backend.entity.User;

public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findAllByOrderByCreatedAtDesc();
    List<Post> findByAuthorOrderByCreatedAtDesc(User author);
}
