package com.example.splitwise.repository;

import com.example.splitwise.model.Expense;
import com.example.splitwise.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    @Query("SELECT e FROM Expense e WHERE e.group.id = :groupId")
    List<Expense> findByGroupId(@Param("groupId") Long groupId);
    
    @Query("SELECT e FROM Expense e WHERE e.paidBy = :user OR KEY(e.splits) = :user")
    List<Expense> findByPaidByOrInvolvingUser(@Param("user") User user);

    @Query("SELECT DISTINCT e FROM Expense e " +
           "LEFT JOIN e.splits s " +
           "WHERE e.paidBy.email = :userEmail " +
           "OR KEY(s).email = :userEmail")
    List<Expense> findExpensesByUserEmail(@Param("userEmail") String userEmail);
}
