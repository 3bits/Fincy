package com.financetracker.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    @GetMapping("/")
    public String home() {
        return "Finance Tracker API is running on port 8081. Available endpoints: /api/transactions, /api/budgets";
    }
}
