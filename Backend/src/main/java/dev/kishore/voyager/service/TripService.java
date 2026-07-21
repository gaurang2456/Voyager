package dev.kishore.voyager.service;

import dev.kishore.voyager.dto.request.CreateTripRequest;
import dev.kishore.voyager.dto.response.TripResponse;
import dev.kishore.voyager.entity.Trip;
import dev.kishore.voyager.entity.User;
import dev.kishore.voyager.mapper.TripMapper;
import dev.kishore.voyager.repository.TripRepository;
import dev.kishore.voyager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TripService {

    private User getCurrentUser() {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));
    }
    private final TripRepository tripRepository;
    private final UserRepository userRepository;
    private final TripMapper tripMapper;

    public TripResponse createTrip(CreateTripRequest request) {

        User user = getCurrentUser();

        Trip trip = tripMapper.toEntity(request);

        trip.setUser(user);

        Trip savedTrip = tripRepository.save(trip);

        return tripMapper.toResponse(savedTrip);
    }
}