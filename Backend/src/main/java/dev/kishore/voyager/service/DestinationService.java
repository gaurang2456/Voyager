package dev.kishore.voyager.service;

import dev.kishore.voyager.dto.request.CreateDestinationRequest;
import dev.kishore.voyager.dto.request.UpdateDestinationRequest;
import dev.kishore.voyager.dto.response.DestinationResponse;
import dev.kishore.voyager.entity.Destination;
import dev.kishore.voyager.entity.Trip;
import dev.kishore.voyager.entity.User;
import dev.kishore.voyager.mapper.DestinationMapper;
import dev.kishore.voyager.repository.DestinationRepository;
import dev.kishore.voyager.repository.TripRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DestinationService {

    private final DestinationRepository destinationRepository;
    private final DestinationMapper destinationMapper;
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

    public DestinationResponse createDestination(Long tripId,
                                                 CreateDestinationRequest request) {

        Trip trip = getOwnedTrip(tripId);

        Destination destination = destinationMapper.toEntity(request);
        destination.setTrip(trip);

        Destination savedDestination = destinationRepository.save(destination);

        return destinationMapper.toResponse(savedDestination);
    }

    public List<DestinationResponse> getDestinations(Long tripId) {

        Trip trip = getOwnedTrip(tripId);

        return destinationMapper.toResponseList(
                destinationRepository.findByTrip(trip)
        );
    }

    public DestinationResponse getDestination(Long tripId,
                                              Long destinationId) {

        Trip trip = getOwnedTrip(tripId);

        Destination destination = destinationRepository
                .findByIdAndTrip(destinationId, trip)
                .orElseThrow(() -> new RuntimeException("Destination not found"));

        return destinationMapper.toResponse(destination);
    }

    public DestinationResponse updateDestination(Long tripId,
                                                 Long destinationId,
                                                 UpdateDestinationRequest request) {

        Trip trip = getOwnedTrip(tripId);

        Destination destination = destinationRepository
                .findByIdAndTrip(destinationId, trip)
                .orElseThrow(() -> new RuntimeException("Destination not found"));

        destinationMapper.updateFromRequest(request, destination);

        Destination updatedDestination = destinationRepository.save(destination);

        return destinationMapper.toResponse(updatedDestination);
    }

    public void deleteDestination(Long tripId,
                                  Long destinationId) {

        Trip trip = getOwnedTrip(tripId);

        Destination destination = destinationRepository
                .findByIdAndTrip(destinationId, trip)
                .orElseThrow(() -> new RuntimeException("Destination not found"));

        destinationRepository.delete(destination);
    }
}