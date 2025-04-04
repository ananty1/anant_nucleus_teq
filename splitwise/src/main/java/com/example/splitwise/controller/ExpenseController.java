package com.example.splitwise.controller;

import com.example.splitwise.model.Expense;
import com.example.splitwise.service.ExpenseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    @Autowired
    private ExpenseService expenseService;

    @PostMapping("")
    public ResponseEntity<Expense> createExpense(@RequestBody Map<String, Object> expenseRequest) {
        System.out.println("Received expense request: " + expenseRequest);
        return ResponseEntity.ok(expenseService.createExpense(expenseRequest));
    }

    @GetMapping("/group/{groupId}")
    public ResponseEntity<List<Expense>> getGroupExpenses(@PathVariable Long groupId) {
        return ResponseEntity.ok(expenseService.getExpensesByGroupId(groupId));
    }

    @GetMapping("/user")
    public ResponseEntity<List<Expense>> getUserExpenses(Authentication authentication) {
        return ResponseEntity.ok(expenseService.getExpensesByUserEmail(authentication.getName()));
    }

    @PutMapping("/{expenseId}")
    public ResponseEntity<Expense> updateExpense(
            @PathVariable Long expenseId,
            @RequestBody Map<String, Object> expenseRequest) {
        return ResponseEntity.ok(expenseService.updateExpense(expenseId, expenseRequest));
    }

    @PostMapping("/{expenseId}/settle")
    public ResponseEntity<Expense> settleExpense(@PathVariable Long expenseId) {
        return ResponseEntity.ok(expenseService.settleExpense(expenseId));
    }

    @GetMapping("/balances")
    public ResponseEntity<Map<String, Object>> getUserBalances(Authentication authentication) {
        return ResponseEntity.ok(expenseService.calculateUserBalances(authentication.getName()));
    }
}
