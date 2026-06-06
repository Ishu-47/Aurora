package com.aurora.aurora_backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.aurora.aurora_backend.entity.Follow;
import com.aurora.aurora_backend.entity.User;

public interface FollowRepository extends JpaRepository<Follow, Long> {
    
    boolean existsByFollowerAndFollowing(User follower, User following);

    Optional<Follow> findByFollowerAndFollowing(User follower, User following);

    long countByFollowing(User user);

    long countByFollower(User user);

    List<Follow> findByFollower(User user);

    List<Follow> findByFollowing(User user);
}
