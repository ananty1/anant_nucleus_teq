package com.example.splitwise.controller;

import com.example.splitwise.model.User;
import com.example.splitwise.service.UserService;
import com.example.splitwise.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtService jwtService;

    @PostMapping("/auth/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        User registeredUser = userService.createUser(user);
        String token = jwtService.generateToken(registeredUser);
        
        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("user", registeredUser);
        
        return ResponseEntity.ok(response);
    }

    @PostMapping("/auth/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
        User user = userService.authenticateUser(
            loginRequest.get("email"),
            loginRequest.get("password")
        );
        
        String token = jwtService.generateToken(user);
        
        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("user", user);
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/users/profile")
    public ResponseEntity<User> getCurrentUserProfile() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.getUserByEmail(auth.getName())
            .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(user);
    }

    @PutMapping("/users/profile")
    public ResponseEntity<User> updateProfile(@RequestBody User userDetails) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = userService.getUserByEmail(auth.getName())
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Set the ID from the authenticated user to prevent ID tampering
        userDetails.setId(currentUser.getId());
        
        User updatedUser = userService.updateUser(userDetails);
        return ResponseEntity.ok(updatedUser);
    }

    @PostMapping("/auth/logout")
    public ResponseEntity<?> logout() {
        // JWT is stateless, so we don't need to do anything server-side
        // The client should remove the token
        return ResponseEntity.ok().build();
    }

    @GetMapping("/auth/validate")
    public ResponseEntity<?> validateToken(@RequestHeader("Authorization") String token) {
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated()) {
                User user = userService.getUserByEmail(auth.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));
                return ResponseEntity.ok(user);
            }
        }
        return ResponseEntity.badRequest().build();
    }

   
}
