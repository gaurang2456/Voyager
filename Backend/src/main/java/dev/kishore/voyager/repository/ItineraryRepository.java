package dev.kishore.voyager.repository;

import dev.kishore.voyager.entity.Itinerary;
import dev.kishore.voyager.entity.Trip;
import dev.kishore.voyager.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ItineraryRepository extends JpaRepository<Itinerary, Long> {

    Optional<Itinerary> findTopByTripAndTripUserOrderByVersionDesc(Trip trip, User user);

    Optional<Itinerary> findTopByTripIdAndTripUserEmailOrderByVersionDesc(Long tripId, String userEmail);

    void deleteByTripIdAndTripUserEmail(Long tripId, String userEmail);
}
