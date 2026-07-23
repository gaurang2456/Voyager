package dev.kishore.voyager.repository;

import dev.kishore.voyager.entity.Destination;
import dev.kishore.voyager.entity.Trip;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DestinationRepository
        extends JpaRepository<Destination,Long> {

    List<Destination> findByTrip(Trip trip);

    Optional<Destination> findByIdAndTrip(Long id, Trip trip);
}