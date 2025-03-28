package com.example.splitwise.service;

import com.example.splitwise.model.Friend;
import com.example.splitwise.model.User;
import com.example.splitwise.repository.FriendRepository;
import com.example.splitwise.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class FriendService {

    @Autowired
    private FriendRepository friendRepository;

    @Autowired
    private UserRepository userRepository;

    public Friend sendFriendRequest(Long userId, String friendEmail) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        User friend = userRepository.findByEmail(friendEmail)
            .orElseThrow(() -> new RuntimeException("Friend not found"));

        Friend friendRequest = new Friend();
        friendRequest.setUser(user);
        friendRequest.setFriend(friend);
        friendRequest.setStatus("PENDING");
        
        return friendRepository.save(friendRequest);
    }

    public Friend acceptFriendRequest(Long requestId) {
        Friend request = friendRepository.findById(requestId)
            .orElseThrow(() -> new RuntimeException("Friend request not found"));
        request.setStatus("ACCEPTED");
        return friendRepository.save(request);
    }

    public List<User> getFriends(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        List<Friend> sentFriendships = friendRepository.findByUserAndStatus(user, "ACCEPTED");
        List<Friend> receivedFriendships = friendRepository.findByFriendAndStatus(user, "ACCEPTED");

        return Stream.concat(
            sentFriendships.stream().map(Friend::getFriend),
            receivedFriendships.stream().map(Friend::getUser)
        ).collect(Collectors.toList());
    }

    public List<Friend> getPendingRequests(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        return friendRepository.findByFriendAndStatus(user, "PENDING");
    }
} 