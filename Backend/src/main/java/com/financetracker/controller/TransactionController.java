package com.financetracker.controller;

import com.financetracker.model.Budget;
import com.financetracker.model.Transaction;
import com.financetracker.repository.BudgetRepository;
import com.financetracker.repository.TransactionRepository;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class TransactionController {

    private final TransactionRepository transactionRepository;
    private final BudgetRepository budgetRepository;

    public TransactionController(TransactionRepository transactionRepository, BudgetRepository budgetRepository) {
        this.transactionRepository = transactionRepository;
        this.budgetRepository = budgetRepository;
    }

    @GetMapping
    public List<Transaction> getAll() {
        return transactionRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Transaction> getById(@PathVariable String id) {
        Optional<Transaction> optional = transactionRepository.findById(id);
        return optional.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public Transaction create(@Valid @RequestBody Transaction transaction) {
        transaction.setId(null);
        return transactionRepository.save(transaction);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        if (transactionRepository.existsById(id)) {
            transactionRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public List<Transaction> uploadCsv(@RequestPart("file") MultipartFile file) {
        List<Transaction> saved = new ArrayList<>();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {
            String line = reader.readLine();
            if (line == null) {
                return saved;
            }

            // Expect header row like: date,type,category,description,amount
            String[] headers = line.split(",");
            while ((line = reader.readLine()) != null) {
                if (line.isBlank()) {
                    continue;
                }
                String[] parts = line.split(",(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)");
                if (parts.length < 5) {
                    continue;
                }

                String date = parts[0].trim().replaceAll("\"", "");
                String type = parts[1].trim().replaceAll("\"", "");
                String category = parts[2].trim().replaceAll("\"", "");
                String description = parts[3].trim().replaceAll("\"", "");
                String amountStr = parts[4].trim().replaceAll("\"", "");

                double amount;
                try {
                    amount = Double.parseDouble(amountStr);
                } catch (NumberFormatException e) {
                    continue;
                }

                Transaction transaction = new Transaction();
                transaction.setDate(date);
                transaction.setType(type);
                transaction.setCategory(category);
                transaction.setDescription(description);
                transaction.setAmount(amount);

                saved.add(transactionRepository.save(transaction));
            }

            // Recalculate budget spent amounts based on all expense transactions.
            List<Transaction> allTransactions = transactionRepository.findAll();
            Map<String, Double> expenseByCategory = allTransactions.stream()
                .filter(t -> "expense".equalsIgnoreCase(t.getType()))
                .collect(Collectors.groupingBy(Transaction::getCategory, Collectors.summingDouble(Transaction::getAmount)));

            List<Budget> budgets = budgetRepository.findAll();
            for (Budget budget : budgets) {
                Double spent = expenseByCategory.getOrDefault(budget.getCategory(), 0.0);
                budget.setSpent(spent);
            }
            budgetRepository.saveAll(budgets);

        } catch (Exception ex) {
            throw new RuntimeException("Failed to parse uploaded CSV", ex);
        }
        return saved;
    }
}
