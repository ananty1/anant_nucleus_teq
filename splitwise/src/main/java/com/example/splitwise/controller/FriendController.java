package com.example.splitwise.controller;

import com.example.splitwise.model.Friend;
import com.example.splitwise.model.User;
import com.example.splitwise.service.FriendService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/friends")
public class FriendController {

    @Autowired
    private FriendService friendService;

    @PostMapping("/request")
    public ResponseEntity<Friend> sendFriendRequest(
            @RequestBody Map<String, String> request) {
        Friend friendRequest = friendService.sendFriendRequest(
            Long.parseLong(request.get("userId")), 
            request.get("friendEmail")
        );
        return ResponseEntity.ok(friendRequest);
    }

    @PostMapping("/accept/{requestId}")
    public ResponseEntity<Friend> acceptFriendRequest(@PathVariable Long requestId) {
        Friend acceptedRequest = friendService.acceptFriendRequest(requestId);
        return ResponseEntity.ok(acceptedRequest);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<User>> getFriends(@PathVariable Long userId) {
        List<User> friends = friendService.getFriends(userId);
        return ResponseEntity.ok(friends);
    }

    @GetMapping("/pending/{userId}")
    public ResponseEntity<List<Friend>> getPendingRequests(@PathVariable Long userId) {
        List<Friend> pendingRequests = friendService.getPendingRequests(userId);
        return ResponseEntity.ok(pendingRequests);
    }
} 