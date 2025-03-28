package com.example.splitwise.service;

import com.example.splitwise.model.Group;
import com.example.splitwise.model.User;
import com.example.splitwise.repository.GroupRepository;
import com.example.splitwise.repository.UserRepository;
import com.example.splitwise.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class GroupService {

    @Autowired
    private GroupRepository groupRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Group> getGroupsByUserEmail(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return groupRepository.findByMembersContaining(user);
    }

    public Group getGroupById(Long groupId) {
        return groupRepository.findById(groupId)
            .orElseThrow(() -> new ResourceNotFoundException("Group not found"));
    }

    @Transactional
    public Group createGroup(String name, String description, String creatorEmail, List<String> memberEmails) {
        User creator = userRepository.findByEmail(creatorEmail)
            .orElseThrow(() -> new ResourceNotFoundException("Creator not found"));

        Set<User> members = memberEmails.stream()
            .map(email -> userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email)))
            .collect(Collectors.toSet());
        members.add(creator);

        Group group = new Group();
        group.setName(name);
        group.setDescription(description);
        group.setCreatedBy(creator);
        group.setMembers(members);

        return groupRepository.save(group);
    }

    @Transactional
    public Group updateGroup(Long groupId, String name, String description) {
        Group group = getGroupById(groupId);
        if (name != null) group.setName(name);
        if (description != null) group.setDescription(description);
        return groupRepository.save(group);
    }

    @Transactional
    public Group addMembers(Long groupId, List<String> memberEmails) {
        Group group = getGroupById(groupId);
        Set<User> newMembers = memberEmails.stream()
            .map(email -> userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email)))
            .collect(Collectors.toSet());
        group.getMembers().addAll(newMembers);
        return groupRepository.save(group);
    }

    @Transactional
    public Group removeMember(Long groupId, Long userId) {
        Group group = getGroupById(groupId);
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        group.getMembers().remove(user);
        return groupRepository.save(group);
    }

    public Object getGroupExpenses(Long groupId) {
        // This will be implemented when we create the Expense model
        return null;
    }

    public Object getGroupBalances(Long groupId) {
        // This will be implemented when we create the Expense model
        return null;
    }
}
