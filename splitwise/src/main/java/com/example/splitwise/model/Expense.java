package com.example.splitwise.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Entity
@Table(name = "expenses")
public class Expense {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "group_id")
    private Group group;

    private String description;
    private BigDecimal amount;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "paid_by_id")
    private User paidBy;

    @ElementCollection
    @CollectionTable(
        name = "expense_splits",
        joinColumns = @JoinColumn(name = "expense_id")
    )
    @MapKeyJoinColumn(name = "user_id")
    @Column(name = "amount")
    private Map<User, BigDecimal> splits = new HashMap<>();

    @Column(name = "split_type")
    private String splitType; // EQUAL, EXACT, PERCENTAGE

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private boolean settled = false;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Group getGroup() { return group; }
    public void setGroup(Group group) { this.group = group; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public User getPaidBy() { return paidBy; }
    public void setPaidBy(User paidBy) { this.paidBy = paidBy; }

    public Map<User, BigDecimal> getSplits() { return splits; }
    public void setSplits(Map<User, BigDecimal> splits) { this.splits = splits; }

    public String getSplitType() { return splitType; }
    public void setSplitType(String splitType) { this.splitType = splitType; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public boolean isSettled() { return settled; }
    public void setSettled(boolean settled) { this.settled = settled; }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
