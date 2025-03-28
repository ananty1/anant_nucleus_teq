package com.example.splitwise.repository;

import com.example.splitwise.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);

    List<User> findByUsernameContainingIgnoreCase(String username);

    List<User> findAll();

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);
}
