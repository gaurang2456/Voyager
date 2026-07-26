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
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
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
        ItineraryResponse response = itineraryMapper.toResponse(savedItinerary);
        response.setModificationSummary(generatedDto.getModificationSummary());
        return response;
    }

    @Transactional
    public ItineraryResponse getItinerary(Long tripId) {
        User user = getCurrentUser();
        Itinerary itinerary = itineraryRepository
                .findTopByTripIdAndTripUserEmailOrderByVersionDesc(tripId, user.getEmail())
                .orElseThrow(() -> new RuntimeException("Itinerary not found for trip: " + tripId));

        if (hasLegacyGenericTitles(itinerary)) {
            log.info("Auto-upgrading legacy generic itinerary in MySQL for trip ID {} to ground-truth Google Places engine...", tripId);
            return regenerateItinerary(tripId, null);
        }

        return itineraryMapper.toResponse(itinerary);
    }

    private boolean hasLegacyGenericTitles(Itinerary itinerary) {
        if (itinerary == null || itinerary.getDays() == null) return false;
        for (var day : itinerary.getDays()) {
            if (day.getActivities() != null) {
                for (var act : day.getActivities()) {
                    if (act.getTitle() != null) {
                        String titleLower = act.getTitle().toLowerCase();
                        if (titleLower.contains("historic old town") ||
                            titleLower.contains("heritage plaza") ||
                            titleLower.contains("artisanal regional bistro") ||
                            titleLower.contains("riverside promenade") ||
                            titleLower.contains("panorama tower") ||
                            titleLower.contains("citadel") ||
                            titleLower.contains("conservatory & meadow") ||
                            titleLower.contains("culinary bazaar") ||
                            titleLower.contains("sunset deck") ||
                            titleLower.contains("royal citadel")) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }

    @Transactional
    public void deleteItinerary(Long tripId) {
        User user = getCurrentUser();
        getOwnedTrip(tripId);
        itineraryRepository.deleteByTripIdAndTripUserEmail(tripId, user.getEmail());
    }

    @Transactional
    public ItineraryResponse regenerateItinerary(Long tripId) {
        return regenerateItinerary(tripId, null);
    }

    @Transactional
    public ItineraryResponse regenerateItinerary(Long tripId, String userInstruction) {
        Trip trip = getOwnedTrip(tripId);
        User user = getCurrentUser();

        Integer nextVersion = itineraryRepository
                .findTopByTripIdAndTripUserEmailOrderByVersionDesc(tripId, user.getEmail())
                .map(existing -> existing.getVersion() + 1)
                .orElse(1);

        List<WeatherForecastDto> weatherForecasts = weatherService.getWeatherForecast(
                trip.getDestination(), trip.getStartDate(), trip.getEndDate()
        );

        GeneratedItineraryDto generatedDto = aiItineraryService.generateItineraryDto(trip, weatherForecasts, userInstruction);

        Itinerary itinerary = itineraryMapper.toEntity(generatedDto);
        itinerary.setTrip(trip);
        itinerary.setGeneratedAt(LocalDateTime.now());
        itinerary.setVersion(nextVersion);

        Itinerary savedItinerary = itineraryRepository.save(itinerary);
        ItineraryResponse response = itineraryMapper.toResponse(savedItinerary);
        response.setModificationSummary(generatedDto.getModificationSummary());
        return response;
    }
}
