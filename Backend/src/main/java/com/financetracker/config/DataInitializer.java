package com.financetracker.config;

import com.financetracker.model.Budget;
import com.financetracker.model.Transaction;
import com.financetracker.repository.BudgetRepository;
import com.financetracker.repository.TransactionRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final TransactionRepository transactionRepository;
    private final BudgetRepository budgetRepository;

    public DataInitializer(TransactionRepository transactionRepository, BudgetRepository budgetRepository) {
        this.transactionRepository = transactionRepository;
        this.budgetRepository = budgetRepository;
    }

    @Override
    public void run(String... args) {
        if (budgetRepository.count() == 0) {
            budgetRepository.saveAll(
                List.of(
                    new Budget(null, "Groceries", 500.0, 250.0, "monthly"),
                    new Budget(null, "Entertainment", 200.0, 120.0, "monthly"),
                    new Budget(null, "Transportation", 300.0, 80.0, "monthly"),
                    new Budget(null, "Dining", 250.0, 0.0, "monthly")
                )
            );
        }

        if (transactionRepository.count() == 0) {
            transactionRepository.saveAll(
                List.of(
                    new Transaction(null, "income", 5000.0, "Salary", "Monthly salary", "2026-03-01"),
                    new Transaction(null, "expense", 1200.0, "Rent", "Monthly rent payment", "2026-03-01"),
                    new Transaction(null, "expense", 250.0, "Groceries", "Weekly groceries", "2026-02-28"),
                    new Transaction(null, "expense", 80.0, "Transportation", "Gas and metro", "2026-02-27"),
                    new Transaction(null, "income", 500.0, "Freelance", "Web design project", "2026-02-25")
                )
            );
        }
    }
}
