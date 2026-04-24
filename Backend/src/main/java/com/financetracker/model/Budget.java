package com.financetracker.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

@Document(collection = "budgets")
public class Budget {

    @Id
    private String id;

    @NotBlank
    private String category;

    @NotNull
    @PositiveOrZero
    private Double limit;

    @NotNull
    @PositiveOrZero
    private Double spent;

    @NotBlank
    private String period;

    public Budget() {
    }

    public Budget(String id, String category, Double limit, Double spent, String period) {
        this.id = id;
        this.category = category;
        this.limit = limit;
        this.spent = spent;
        this.period = period;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Double getLimit() {
        return limit;
    }

    public void setLimit(Double limit) {
        this.limit = limit;
    }

    public Double getSpent() {
        return spent;
    }

    public void setSpent(Double spent) {
        this.spent = spent;
    }

    public String getPeriod() {
        return period;
    }

    public void setPeriod(String period) {
        this.period = period;
    }
}
