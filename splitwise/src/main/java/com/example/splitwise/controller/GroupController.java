package com.example.splitwise.controller;

import com.example.splitwise.model.Group;
import com.example.splitwise.model.User;
import com.example.splitwise.service.GroupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/groups")
public class GroupController {

    @Autowired
    private GroupService groupService;

    @GetMapping
    public ResponseEntity<List<Group>> getAllGroups() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = auth.getName();
        return ResponseEntity.ok(groupService.getGroupsByUserEmail(userEmail));
    }

    @GetMapping("/{groupId}")
    public ResponseEntity<Group> getGroupById(@PathVariable Long groupId) {
        return ResponseEntity.ok(groupService.getGroupById(groupId));
    }

    @PostMapping
    public ResponseEntity<Group> createGroup(@RequestBody Map<String, Object> groupRequest) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = auth.getName();
        return ResponseEntity.ok(groupService.createGroup(
            (String) groupRequest.get("name"),
            (String) groupRequest.get("description"),
            userEmail,
            (List<String>) groupRequest.get("memberEmails")
        ));
    }

    @PutMapping("/{groupId}")
    public ResponseEntity<Group> updateGroup(
            @PathVariable Long groupId,
            @RequestBody Map<String, Object> groupRequest) {
        return ResponseEntity.ok(groupService.updateGroup(
            groupId,
            (String) groupRequest.get("name"),
            (String) groupRequest.get("description")
        ));
    }

    @PostMapping("/{groupId}/members")
    public ResponseEntity<Group> addMembers(
            @PathVariable Long groupId,
            @RequestBody List<String> memberEmails) {
        return ResponseEntity.ok(groupService.addMembers(groupId, memberEmails));
    }

    @DeleteMapping("/{groupId}/members/{userId}")
    public ResponseEntity<Group> removeMember(
            @PathVariable Long groupId,
            @PathVariable Long userId) {
        return ResponseEntity.ok(groupService.removeMember(groupId, userId));
    }

    @GetMapping("/{groupId}/expenses")
    public ResponseEntity<?> getGroupExpenses(@PathVariable Long groupId) {
        return ResponseEntity.ok(groupService.getGroupExpenses(groupId));
    }

    @GetMapping("/{groupId}/balances")
    public ResponseEntity<?> getGroupBalances(@PathVariable Long groupId) {
        return ResponseEntity.ok(groupService.getGroupBalances(groupId));
    }
}
