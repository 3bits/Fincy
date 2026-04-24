package com.financetracker.controller;

import com.financetracker.model.Budget;
import com.financetracker.repository.BudgetRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/budgets")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class BudgetController {

    private final BudgetRepository budgetRepository;

    public BudgetController(BudgetRepository budgetRepository) {
        this.budgetRepository = budgetRepository;
    }

    @GetMapping
    public List<Budget> getAll() {
        return budgetRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Budget> getById(@PathVariable String id) {
        Optional<Budget> optional = budgetRepository.findById(id);
        return optional.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public Budget create(@Valid @RequestBody Budget budget) {
        budget.setId(null);
        if (budget.getSpent() == null) {
            budget.setSpent(0.0);
        }
        return budgetRepository.save(budget);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Budget> update(@PathVariable String id, @Valid @RequestBody Budget budget) {
        return budgetRepository.findById(id)
            .map(existing -> {
                existing.setCategory(budget.getCategory());
                existing.setLimit(budget.getLimit());
                existing.setSpent(budget.getSpent());
                existing.setPeriod(budget.getPeriod());
                return ResponseEntity.ok(budgetRepository.save(existing));
            })
            .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        if (budgetRepository.existsById(id)) {
            budgetRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
