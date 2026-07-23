package dev.kishore.voyager.service;

import dev.kishore.voyager.dto.ai.GeneratedItineraryDto;
import dev.kishore.voyager.dto.response.ItineraryResponse;
import dev.kishore.voyager.dto.weather.WeatherForecastDto;
import dev.kishore.voyager.entity.Itinerary;
import dev.kishore.voyager.entity.Trip;
import dev.kishore.voyager.entity.User;
import dev.kishore.voyager.mapper.ItineraryMapper;
import dev.kishore.voyager.repository.ItineraryRepository;
import dev.kishore.voyager.repository.TripRepository;
import dev.kishore.voyager.repository.UserRepository;
import dev.kishore.voyager.service.weather.WeatherService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ItineraryService {

    private final ItineraryRepository itineraryRepository;
    private final TripRepository tripRepository;
    private final UserRepository userRepository;
    private final AIItineraryService aiItineraryService;
    private final WeatherService weatherService;
    private final ItineraryMapper itineraryMapper;

    private User getCurrentUser() {
        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private Trip getOwnedTrip(Long tripId) {
        return tripRepository
                .findByIdAndUser(tripId, getCurrentUser())
                .orElseThrow(() -> new RuntimeException("Trip not found"));
    }

    @Transactional
    public ItineraryResponse generateItinerary(Long tripId) {
        Trip trip = getOwnedTrip(tripId);

        List<WeatherForecastDto> weatherForecasts = weatherService.getWeatherForecast(
                trip.getDestination(), trip.getStartDate(), trip.getEndDate()
        );

        GeneratedItineraryDto generatedDto = aiItineraryService.generateItineraryDto(trip, weatherForecasts);

        Itinerary itinerary = itineraryMapper.toEntity(generatedDto);
        itinerary.setTrip(trip);
        itinerary.setGeneratedAt(LocalDateTime.now());
        itinerary.setVersion(1);

        Itinerary savedItinerary = itineraryRepository.save(itinerary);
        return itineraryMapper.toResponse(savedItinerary);
    }

    @Transactional(readOnly = true)
    public ItineraryResponse getItinerary(Long tripId) {
        User user = getCurrentUser();
        Itinerary itinerary = itineraryRepository
                .findTopByTripIdAndTripUserEmailOrderByVersionDesc(tripId, user.getEmail())
                .orElseThrow(() -> new RuntimeException("Itinerary not found for trip: " + tripId));

        return itineraryMapper.toResponse(itinerary);
    }

    @Transactional
    public void deleteItinerary(Long tripId) {
        User user = getCurrentUser();
        getOwnedTrip(tripId); // Verifies ownership
        itineraryRepository.deleteByTripIdAndTripUserEmail(tripId, user.getEmail());
    }

    @Transactional
    public ItineraryResponse regenerateItinerary(Long tripId) {
        Trip trip = getOwnedTrip(tripId);
        User user = getCurrentUser();

        Integer nextVersion = itineraryRepository
                .findTopByTripIdAndTripUserEmailOrderByVersionDesc(tripId, user.getEmail())
                .map(existing -> existing.getVersion() + 1)
                .orElse(1);

        List<WeatherForecastDto> weatherForecasts = weatherService.getWeatherForecast(
                trip.getDestination(), trip.getStartDate(), trip.getEndDate()
        );

        GeneratedItineraryDto generatedDto = aiItineraryService.generateItineraryDto(trip, weatherForecasts);

        Itinerary itinerary = itineraryMapper.toEntity(generatedDto);
        itinerary.setTrip(trip);
        itinerary.setGeneratedAt(LocalDateTime.now());
        itinerary.setVersion(nextVersion);

        Itinerary savedItinerary = itineraryRepository.save(itinerary);
        return itineraryMapper.toResponse(savedItinerary);
    }
}
