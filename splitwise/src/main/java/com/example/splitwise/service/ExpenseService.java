package com.example.splitwise.service;

import com.example.splitwise.model.Expense;
import com.example.splitwise.model.Group;
import com.example.splitwise.model.User;
import com.example.splitwise.repository.ExpenseRepository;
import com.example.splitwise.repository.GroupRepository;
import com.example.splitwise.repository.UserRepository;
import com.example.splitwise.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;

@Service
public class ExpenseService {

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private GroupRepository groupRepository;

    @Transactional
    public Expense createExpense(Map<String, Object> expenseRequest) {
        User paidBy = userRepository.findByEmail((String) expenseRequest.get("paidByEmail"))
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        Group group = groupRepository.findById(Long.parseLong(expenseRequest.get("groupId").toString()))
            .orElseThrow(() -> new ResourceNotFoundException("Group not found"));

        Expense expense = new Expense();
        expense.setDescription((String) expenseRequest.get("description"));
        expense.setAmount(new BigDecimal(expenseRequest.get("amount").toString()));
        expense.setPaidBy(paidBy);
        expense.setGroup(group);
        expense.setSplitType((String) expenseRequest.get("splitType"));

        // Handle splits based on split type
        Map<String, BigDecimal> splitAmounts = (Map<String, BigDecimal>) expenseRequest.get("splits");
        Map<User, BigDecimal> splits = new HashMap<>();

        if ("EQUAL".equals(expense.getSplitType())) {
            BigDecimal splitAmount = expense.getAmount()
                .divide(BigDecimal.valueOf(group.getMembers().size()), 2, RoundingMode.HALF_UP);
            for (User member : group.getMembers()) {
                splits.put(member, splitAmount);
            }
        } else {
            for (Map.Entry<String, BigDecimal> entry : splitAmounts.entrySet()) {
                User user = userRepository.findByEmail(entry.getKey())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));
                splits.put(user, entry.getValue());
            }
        }

        expense.setSplits(splits);
        return expenseRepository.save(expense);
    }

    public List<Expense> getExpensesByGroupId(Long groupId) {
        return expenseRepository.findByGroupId(groupId);
    }

    public List<Expense> getExpensesByUserEmail(String userEmail) {
        return expenseRepository.findExpensesByUserEmail(userEmail);
    }

    @Transactional
    public Expense updateExpense(Long expenseId, Map<String, Object> expenseRequest) {
        Expense expense = expenseRepository.findById(expenseId)
            .orElseThrow(() -> new ResourceNotFoundException("Expense not found"));
        
        if (expenseRequest.containsKey("description")) {
            expense.setDescription((String) expenseRequest.get("description"));
        }
        if (expenseRequest.containsKey("amount")) {
            expense.setAmount(new BigDecimal(expenseRequest.get("amount").toString()));
        }
        // Update other fields as needed
        
        return expenseRepository.save(expense);
    }

    @Transactional
    public Expense settleExpense(Long expenseId) {
        Expense expense = expenseRepository.findById(expenseId)
            .orElseThrow(() -> new ResourceNotFoundException("Expense not found"));
        expense.setSettled(true);
        return expenseRepository.save(expense);
    }

    public Map<String, Object> calculateUserBalances(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        List<Expense> expenses = expenseRepository.findByPaidByOrInvolvingUser(user);
        Map<User, BigDecimal> balances = new HashMap<>();

        for (Expense expense : expenses) {
            if (expense.isSettled()) continue;

            // Add amount paid
            if (expense.getPaidBy().equals(user)) {
                for (Map.Entry<User, BigDecimal> split : expense.getSplits().entrySet()) {
                    if (!split.getKey().equals(user)) {
                        balances.merge(split.getKey(), split.getValue(), BigDecimal::add);
                    }
                }
            }

            // Subtract amount owed
            if (expense.getSplits().containsKey(user)) {
                User paidBy = expense.getPaidBy();
                if (!paidBy.equals(user)) {
                    balances.merge(paidBy, expense.getSplits().get(user).negate(), BigDecimal::add);
                }
            }
        }

        Map<String, Object> result = new HashMap<>();
        result.put("youOwe", balances.values().stream()
            .filter(amount -> amount.compareTo(BigDecimal.ZERO) < 0)
            .map(amount -> amount.abs())
            .reduce(BigDecimal.ZERO, BigDecimal::add));
        result.put("youAreOwed", balances.values().stream()
            .filter(amount -> amount.compareTo(BigDecimal.ZERO) > 0)
            .reduce(BigDecimal.ZERO, BigDecimal::add));
        result.put("detailedBalances", balances);

        return result;
    }
}
