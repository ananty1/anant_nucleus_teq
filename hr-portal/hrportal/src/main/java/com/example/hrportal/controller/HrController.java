package com.example.hrportal.controller;

import com.example.hrportal.model.HR;
import com.example.hrportal.repository.HrRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/hr")
@CrossOrigin(origins = "*")  // Allow frontend access
public class HrController {

    private final HrRepository hrRepository;

    public HrController(HrRepository hrRepository) {
        this.hrRepository = hrRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody HR hr) {
        HR foundHr = hrRepository.findByEmailAndPassword(hr.getEmail(), hr.getPassword());
        if (foundHr != null) {
            return ResponseEntity.ok("Login successful");
        } else {
            return ResponseEntity.status(401).body("Invalid email or password");
        }
    }
}
