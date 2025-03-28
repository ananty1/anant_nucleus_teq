package com.example.splitwise.repository;

import com.example.splitwise.model.Friend;
import com.example.splitwise.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FriendRepository extends JpaRepository<Friend, Long> {
    List<Friend> findByUserAndStatus(User user, String status);
    List<Friend> findByFriendAndStatus(User friend, String status);
} 