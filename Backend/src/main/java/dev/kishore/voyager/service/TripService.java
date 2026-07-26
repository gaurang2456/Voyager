package dev.kishore.voyager.service;

import dev.kishore.voyager.dto.request.CreateTripRequest;
import dev.kishore.voyager.dto.request.UpdateTripRequest;
import dev.kishore.voyager.dto.response.TripResponse;
import dev.kishore.voyager.entity.Trip;
import dev.kishore.voyager.entity.User;
import dev.kishore.voyager.mapper.TripMapper;
import dev.kishore.voyager.repository.DestinationRepository;
import dev.kishore.voyager.repository.ExpenseRepository;
import dev.kishore.voyager.repository.ItineraryRepository;
import dev.kishore.voyager.repository.TripRepository;
import dev.kishore.voyager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TripService {

    private final TripRepository tripRepository;
    private final UserRepository userRepository;
    private final ItineraryRepository itineraryRepository;
    private final ExpenseRepository expenseRepository;
    private final DestinationRepository destinationRepository;
    private final TripMapper tripMapper;

    private User getCurrentUser() {
        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public List<TripResponse> getMyTrips() {
        User user = getCurrentUser();
        List<Trip> trips = tripRepository.findByUser(user);
        return tripMapper.toResponseList(trips);
    }

    public TripResponse createTrip(CreateTripRequest request) {
        User user = getCurrentUser();
        Trip trip = tripMapper.toEntity(request);
        trip.setUser(user);
        Trip savedTrip = tripRepository.save(trip);
        return tripMapper.toResponse(savedTrip);
    }

    public TripResponse getTripById(Long id) {
        User user = getCurrentUser();
        Trip trip = tripRepository
                .findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Trip not found"));

        return tripMapper.toResponse(trip);
    }

    public TripResponse updateTrip(Long id, UpdateTripRequest request) {
        User user = getCurrentUser();
        Trip trip = tripRepository
                .findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Trip not found"));

        tripMapper.updateTripFromRequest(request, trip);
        Trip updatedTrip = tripRepository.save(trip);
        return tripMapper.toResponse(updatedTrip);
    }

    @Transactional
    public void deleteTrip(Long id) {
        User user = getCurrentUser();
        Trip trip = tripRepository
                .findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Trip not found"));

        itineraryRepository.deleteByTripIdAndTripUserEmail(id, user.getEmail());
        expenseRepository.deleteByTrip(trip);
        destinationRepository.deleteByTrip(trip);
        tripRepository.delete(trip);
    }
}