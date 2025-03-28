package com.example.splitwise.controller;

import com.example.splitwise.service.ExpenseService;
import com.example.splitwise.service.GroupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private ExpenseService expenseService;

    @Autowired
    private GroupService groupService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getDashboardData(Authentication authentication) {
        String userEmail = authentication.getName();
        Map<String, Object> dashboardData = new HashMap<>();

        // Get user's balances
        Map<String, Object> balances = expenseService.calculateUserBalances(userEmail);
        dashboardData.put("totalBalance", balances.get("youAreOwed"));
        dashboardData.put("youOwe", balances.get("youOwe"));
        dashboardData.put("youAreOwed", balances.get("youAreOwed"));

        // Get user's groups
        dashboardData.put("groups", groupService.getGroupsByUserEmail(userEmail));

        // Get recent activities (expenses)
        dashboardData.put("recentActivities", 
            expenseService.getExpensesByUserEmail(userEmail));

        return ResponseEntity.ok(dashboardData);
    }
} 