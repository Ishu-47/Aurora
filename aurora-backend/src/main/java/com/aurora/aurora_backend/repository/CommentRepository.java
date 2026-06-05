package com.aurora.aurora_backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.aurora.aurora_backend.entity.Comment;
import com.aurora.aurora_backend.entity.Post;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    List<Comment> findByPostOrderByCreatedAtAsc(Post post);

}