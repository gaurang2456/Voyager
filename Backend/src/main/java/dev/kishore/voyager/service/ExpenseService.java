package dev.kishore.voyager.service;

import dev.kishore.voyager.dto.request.CreateExpenseRequest;
import dev.kishore.voyager.dto.request.UpdateExpenseRequest;
import dev.kishore.voyager.dto.response.ExpenseResponse;
import dev.kishore.voyager.entity.Expense;
import dev.kishore.voyager.entity.Trip;
import dev.kishore.voyager.entity.User;
import dev.kishore.voyager.mapper.ExpenseMapper;
import dev.kishore.voyager.repository.ExpenseRepository;
import dev.kishore.voyager.repository.TripRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final ExpenseMapper expenseMapper;
    private final TripRepository tripRepository;

    private User getCurrentUser() {
        return (User) SecurityContextHolder.getContext()
                .getAuthentication()
                .getPrincipal();
    }

    private Trip getOwnedTrip(Long tripId) {
        return tripRepository
                .findByIdAndUser(tripId, getCurrentUser())
                .orElseThrow(() -> new RuntimeException("Trip not found"));
    }

    public ExpenseResponse createExpense(Long tripId,
                                         CreateExpenseRequest request) {

        Trip trip = getOwnedTrip(tripId);

        Expense expense = expenseMapper.toEntity(request);
        expense.setTrip(trip);

        Expense savedExpense = expenseRepository.save(expense);

        return expenseMapper.toResponse(savedExpense);
    }

    public List<ExpenseResponse> getExpenses(Long tripId) {

        Trip trip = getOwnedTrip(tripId);

        return expenseMapper.toResponseList(
                expenseRepository.findByTrip(trip)
        );
    }

    public ExpenseResponse getExpense(Long tripId,
                                      Long expenseId) {

        Trip trip = getOwnedTrip(tripId);

        Expense expense = expenseRepository
                .findByIdAndTrip(expenseId, trip)
                .orElseThrow(() -> new RuntimeException("Expense not found"));

        return expenseMapper.toResponse(expense);
    }

    public ExpenseResponse updateExpense(Long tripId,
                                         Long expenseId,
                                         UpdateExpenseRequest request) {

        Trip trip = getOwnedTrip(tripId);

        Expense expense = expenseRepository
                .findByIdAndTrip(expenseId, trip)
                .orElseThrow(() -> new RuntimeException("Expense not found"));

        expenseMapper.updateFromRequest(request, expense);

        Expense updatedExpense = expenseRepository.save(expense);

        return expenseMapper.toResponse(updatedExpense);
    }

    public void deleteExpense(Long tripId,
                              Long expenseId) {

        Trip trip = getOwnedTrip(tripId);

        Expense expense = expenseRepository
                .findByIdAndTrip(expenseId, trip)
                .orElseThrow(() -> new RuntimeException("Expense not found"));

        expenseRepository.delete(expense);
    }
}