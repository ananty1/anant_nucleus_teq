package com.example.hrportal.repository;

import com.example.hrportal.model.HR;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HrRepository extends JpaRepository<HR, Long> {
    HR findByEmailAndPassword(String email, String password);
}
