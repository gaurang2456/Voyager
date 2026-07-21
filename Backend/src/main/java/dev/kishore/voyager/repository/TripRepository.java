package dev.kishore.voyager.repository;

import dev.kishore.voyager.entity.Trip;
import dev.kishore.voyager.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TripRepository extends JpaRepository<Trip, Long> {

    List<Trip> findByUser(User user);

    Optional<Trip> findByIdAndUser(Long id, User user);
}