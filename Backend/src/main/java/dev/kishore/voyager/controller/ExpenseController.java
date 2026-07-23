package dev.kishore.voyager.controller;

import dev.kishore.voyager.dto.request.CreateExpenseRequest;
import dev.kishore.voyager.dto.request.UpdateExpenseRequest;
import dev.kishore.voyager.dto.response.ExpenseResponse;
import dev.kishore.voyager.service.ExpenseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trips/{tripId}/expenses")
@RequiredArgsConstructor
public class ExpenseController {

    private final ExpenseService expenseService;

    @PostMapping
    public ResponseEntity<ExpenseResponse> createExpense(
            @PathVariable Long tripId,
            @RequestBody CreateExpenseRequest request) {

        return ResponseEntity.ok(
                expenseService.createExpense(tripId, request)
        );
    }

    @GetMapping
    public ResponseEntity<List<ExpenseResponse>> getExpenses(
            @PathVariable Long tripId) {

        return ResponseEntity.ok(
                expenseService.getExpenses(tripId)
        );
    }

    @GetMapping("/{expenseId}")
    public ResponseEntity<ExpenseResponse> getExpense(
            @PathVariable Long tripId,
            @PathVariable Long expenseId) {

        return ResponseEntity.ok(
                expenseService.getExpense(tripId, expenseId)
        );
    }

    @PutMapping("/{expenseId}")
    public ResponseEntity<ExpenseResponse> updateExpense(
            @PathVariable Long tripId,
            @PathVariable Long expenseId,
            @RequestBody UpdateExpenseRequest request) {

        return ResponseEntity.ok(
                expenseService.updateExpense(
                        tripId,
                        expenseId,
                        request
                )
        );
    }

    @DeleteMapping("/{expenseId}")
    public ResponseEntity<Void> deleteExpense(
            @PathVariable Long tripId,
            @PathVariable Long expenseId) {

        expenseService.deleteExpense(tripId, expenseId);

        return ResponseEntity.noContent().build();
    }
}