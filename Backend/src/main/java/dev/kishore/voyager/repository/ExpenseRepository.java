package dev.kishore.voyager.repository;

import dev.kishore.voyager.entity.Expense;
import dev.kishore.voyager.entity.Trip;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    List<Expense> findByTrip(Trip trip);

    Optional<Expense> findByIdAndTrip(Long id, Trip trip);
}