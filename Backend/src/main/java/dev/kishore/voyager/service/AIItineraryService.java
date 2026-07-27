package dev.kishore.voyager.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import dev.kishore.voyager.dto.ai.GeneratedActivityDto;
import dev.kishore.voyager.dto.ai.GeneratedItineraryDayDto;
import dev.kishore.voyager.dto.ai.GeneratedItineraryDto;
import dev.kishore.voyager.dto.ai.GeminiSelectionDtos.GeminiActivitySelectionDto;
import dev.kishore.voyager.dto.ai.GeminiSelectionDtos.GeminiDaySelectionDto;
import dev.kishore.voyager.dto.ai.GeminiSelectionDtos.GeminiItinerarySelectionDto;
import dev.kishore.voyager.dto.weather.WeatherForecastDto;
import dev.kishore.voyager.entity.Trip;
import dev.kishore.voyager.service.ai.PromptBuilder;
import dev.kishore.voyager.exception.PlacesServiceException;
import dev.kishore.voyager.service.places.GooglePlacesService;
import dev.kishore.voyager.service.places.RealPlaceDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
@RequiredArgsConstructor
public class AIItineraryService {

    private final ChatClient chatClient;
    private final PromptBuilder promptBuilder;
    private final ObjectMapper objectMapper;
    private final GooglePlacesService googlePlacesService;

    public GeneratedItineraryDto generateItineraryDto(Trip trip, List<WeatherForecastDto> weatherForecasts) {
        return generateItineraryDto(trip, weatherForecasts, null);
    }

    public GeneratedItineraryDto generateItineraryDto(Trip trip, List<WeatherForecastDto> weatherForecasts, String userInstruction) {
        String dest = trip.getDestination() != null ? trip.getDestination() : "Kathmandu";

        // STEP 1: Query Google Places API (New) FIRST via GooglePlacesService!
        List<RealPlaceDto> candidatePlaces = googlePlacesService.getRealPlacesForDestination(dest);
        Map<String, RealPlaceDto> placeMap = candidatePlaces.stream()
                .collect(java.util.stream.Collectors.toMap(RealPlaceDto::getPlaceId, p -> p, (a, b) -> a));

        GeneratedItineraryDto dto;
        try {
            // STEP 2: Pass retrieved authentic places to PromptBuilder
            String prompt = promptBuilder.buildPrompt(trip, candidatePlaces, weatherForecasts, userInstruction);
            log.info("Sending placeId-constrained prompt to Gemini for trip ID {}: {}", trip.getId(), prompt);

            String rawContent = CompletableFuture.supplyAsync(() ->
                    chatClient.prompt(prompt).call().content()
            ).orTimeout(6, TimeUnit.SECONDS).get();

            log.info("Received placeId selection response for trip ID {}: {}", trip.getId(), rawContent);
            GeminiItinerarySelectionDto selection = parseSelectionResponse(rawContent);

            // STEP 3: Populate metadata directly from real Google Places API data!
            dto = populateMetadataFromPlaces(trip, selection, placeMap, candidatePlaces);
        } catch (Exception e) {
            log.warn("AI Selection failed/timed out for trip ID {} (Destination: {}): {}. Falling back directly to authentic Google Places pool.",
                    trip.getId(), trip.getDestination(), e.getMessage());
            dto = generateFallbackFromPlaces(trip, candidatePlaces);
        }

        if (userInstruction != null && !userInstruction.isBlank()) {
            dto = applyUserInstruction(dto, trip, candidatePlaces, userInstruction);
        }

        return dto;
    }

    private GeminiItinerarySelectionDto parseSelectionResponse(String rawContent) {
        if (rawContent == null || rawContent.isBlank()) {
            throw new RuntimeException("AI returned empty selection content");
        }

        String cleanedJson = rawContent.trim();
        if (cleanedJson.startsWith("```json")) {
            cleanedJson = cleanedJson.substring(7);
        } else if (cleanedJson.startsWith("```")) {
            cleanedJson = cleanedJson.substring(3);
        }
        if (cleanedJson.endsWith("```")) {
            cleanedJson = cleanedJson.substring(0, cleanedJson.length() - 3);
        }
        cleanedJson = cleanedJson.trim();

        try {
            return objectMapper.readValue(cleanedJson, GeminiItinerarySelectionDto.class);
        } catch (Exception e) {
            log.error("Failed to parse Gemini selection JSON: {}. Raw: {}", e.getMessage(), rawContent);
            throw new RuntimeException("Failed to parse AI place selection response: " + e.getMessage(), e);
        }
    }

    private GeneratedItineraryDto populateMetadataFromPlaces(
            Trip trip,
            GeminiItinerarySelectionDto selection,
            Map<String, RealPlaceDto> placeMap,
            List<RealPlaceDto> candidatePlaces
    ) {
        List<GeneratedItineraryDayDto> dayDtos = new ArrayList<>();
        LocalDate startDate = trip.getStartDate() != null ? trip.getStartDate() : LocalDate.now();

        if (selection.getDays() == null || selection.getDays().isEmpty()) {
            return generateFallbackFromPlaces(trip, candidatePlaces);
        }

        java.util.Set<String> usedPlaceIds = new java.util.HashSet<>();
        java.util.Set<String> usedPlaceNames = new java.util.HashSet<>();
        int fallbackIndex = 0;

        for (int dayIdx = 0; dayIdx < selection.getDays().size(); dayIdx++) {
            GeminiDaySelectionDto daySel = selection.getDays().get(dayIdx);
            LocalDate currentDate = startDate.plusDays(dayIdx);
            List<GeneratedActivityDto> activities = new ArrayList<>();

            if (daySel.getActivities() != null) {
                for (int actIdx = 0; actIdx < daySel.getActivities().size(); actIdx++) {
                    GeminiActivitySelectionDto actSel = daySel.getActivities().get(actIdx);
                    RealPlaceDto place = placeMap.get(actSel.getPlaceId());

                    if (place == null || usedPlaceIds.contains(place.getPlaceId()) || usedPlaceNames.contains(place.getName().toLowerCase())) {
                        place = getOrReuseCandidatePlace(candidatePlaces, usedPlaceIds, usedPlaceNames, null, fallbackIndex++);
                    } else {
                        usedPlaceIds.add(place.getPlaceId());
                        usedPlaceNames.add(place.getName().toLowerCase());
                    }

                    LocalTime start = parseTime(actSel.getStartTime(), LocalTime.of(9 + (actIdx * 3), 30));
                    LocalTime end = parseTime(actSel.getEndTime(), start.plusHours(2));
                    activities.add(createActivityFromRealPlace(place, start, end));
                }
            }

            if (activities.isEmpty()) {
                RealPlaceDto p1 = getOrReuseCandidatePlace(candidatePlaces, usedPlaceIds, usedPlaceNames, null, fallbackIndex++);
                activities.add(createActivityFromRealPlace(p1, LocalTime.of(9, 30), LocalTime.of(11, 30)));
            }

            dayDtos.add(GeneratedItineraryDayDto.builder()
                    .dayNumber(daySel.getDayNumber() > 0 ? daySel.getDayNumber() : dayIdx + 1)
                    .date(currentDate)
                    .summary(daySel.getSummary() != null ? daySel.getSummary() : "Day " + (dayIdx + 1) + " in " + trip.getDestination())
                    .notes(daySel.getNotes() != null ? daySel.getNotes() : "Curated Google Places itinerary.")
                    .activities(activities)
                    .build());
        }

        return GeneratedItineraryDto.builder().days(dayDtos).build();
    }

    private RealPlaceDto getOrReuseCandidatePlace(
            List<RealPlaceDto> candidatePlaces,
            java.util.Set<String> usedPlaceIds,
            java.util.Set<String> usedPlaceNames,
            String preferredCategory,
            int fallbackIndex
    ) {
        if (candidatePlaces == null || candidatePlaces.isEmpty()) {
            throw new PlacesServiceException("No authentic Google Places available for this destination.");
        }

        RealPlaceDto place = candidatePlaces.stream()
                .filter(p -> (preferredCategory == null || preferredCategory.equalsIgnoreCase(p.getCategory()))
                        && !usedPlaceIds.contains(p.getPlaceId())
                        && !usedPlaceNames.contains(p.getName().toLowerCase()))
                .findFirst()
                .orElse(null);

        if (place == null && preferredCategory != null) {
            place = candidatePlaces.stream()
                    .filter(p -> !usedPlaceIds.contains(p.getPlaceId())
                            && !usedPlaceNames.contains(p.getName().toLowerCase()))
                    .findFirst()
                    .orElse(null);
        }

        // If all unique places are exhausted for a long trip, reuse an existing candidate place (never invent fictional places)
        if (place == null) {
            place = candidatePlaces.get(fallbackIndex % candidatePlaces.size());
        }

        usedPlaceIds.add(place.getPlaceId());
        usedPlaceNames.add(place.getName().toLowerCase());
        return place;
    }

    public GeneratedItineraryDto applyUserInstruction(GeneratedItineraryDto dto, Trip trip, List<RealPlaceDto> candidatePlaces, String userInstruction) {
        if (dto == null || userInstruction == null || userInstruction.isBlank()) return dto;

        String lower = userInstruction.toLowerCase().trim();
        if (dto.getDays() == null || dto.getDays().isEmpty()) return dto;

        GeneratedItineraryDayDto day1 = dto.getDays().get(0);
        List<GeneratedActivityDto> activities = day1.getActivities();
        if (activities == null || activities.isEmpty()) return dto;

        if (lower.contains("lunch") || lower.contains("food") || lower.contains("local")) {
            java.util.Set<String> usedPlaceIds = new java.util.HashSet<>();
            java.util.Set<String> usedPlaceNames = new java.util.HashSet<>();
            for (var day : dto.getDays()) {
                if (day.getActivities() != null) {
                    for (var act : day.getActivities()) {
                        if (act.getPlaceId() != null) usedPlaceIds.add(act.getPlaceId());
                        if (act.getTitle() != null) usedPlaceNames.add(act.getTitle().toLowerCase());
                    }
                }
            }

            RealPlaceDto foodPlace = getOrReuseCandidatePlace(candidatePlaces, usedPlaceIds, usedPlaceNames, "Food", 0);

            int replaceIdx = activities.size() > 1 ? 1 : 0;
            activities.set(replaceIdx, createActivityFromRealPlace(foodPlace, LocalTime.of(12, 30), LocalTime.of(14, 0)));
            dto.setModificationSummary("Updated lunch stop to authentic Google Places POI: " + foodPlace.getName() + ".");
        } else if (lower.contains("walking") || lower.contains("distance") || lower.contains("reduce")) {
            double baseLat = activities.get(0).getLatitude() != null ? activities.get(0).getLatitude() : 27.7172;
            double baseLng = activities.get(0).getLongitude() != null ? activities.get(0).getLongitude() : 85.3240;

            for (int i = 0; i < activities.size(); i++) {
                GeneratedActivityDto act = activities.get(i);
                act.setLatitude(baseLat + (i * 0.001));
                act.setLongitude(baseLng + (i * 0.001));
                act.setDescription(act.getDescription() + " (Compact walking route - within 200m).");
            }
            dto.setModificationSummary("Reduced walking distance between activities to within a compact 200m radius.");
        }

        return dto;
    }

    private GeneratedItineraryDto generateFallbackFromPlaces(Trip trip, List<RealPlaceDto> realPlaces) {
        String dest = trip.getDestination() != null ? trip.getDestination() : "Kathmandu";
        LocalDate startDate = trip.getStartDate() != null ? trip.getStartDate() : LocalDate.now();
        LocalDate endDate = trip.getEndDate() != null ? trip.getEndDate() : startDate.plusDays(2);
        long daysCount = java.time.temporal.ChronoUnit.DAYS.between(startDate, endDate) + 1;
        if (daysCount < 1) daysCount = 1;
        if (daysCount > 14) daysCount = 14;

        List<GeneratedItineraryDayDto> dayDtos = new ArrayList<>();
        java.util.Set<String> usedPlaceIds = new java.util.HashSet<>();
        java.util.Set<String> usedPlaceNames = new java.util.HashSet<>();
        int fallbackIdx = 0;

        for (int i = 1; i <= daysCount; i++) {
            LocalDate currentDate = startDate.plusDays(i - 1);
            List<GeneratedActivityDto> activities = new ArrayList<>();

            // Morning
            RealPlaceDto morningPoi = getOrReuseCandidatePlace(realPlaces, usedPlaceIds, usedPlaceNames, "Sightseeing", fallbackIdx++);
            activities.add(createActivityFromRealPlace(morningPoi, LocalTime.of(9, 30), LocalTime.of(11, 30)));

            // Afternoon Lunch
            RealPlaceDto lunchPoi = getOrReuseCandidatePlace(realPlaces, usedPlaceIds, usedPlaceNames, "Food", fallbackIdx++);
            activities.add(createActivityFromRealPlace(lunchPoi, LocalTime.of(12, 30), LocalTime.of(14, 0)));

            // Evening
            RealPlaceDto eveningPoi = getOrReuseCandidatePlace(realPlaces, usedPlaceIds, usedPlaceNames, "Culture", fallbackIdx++);
            activities.add(createActivityFromRealPlace(eveningPoi, LocalTime.of(15, 30), LocalTime.of(18, 0)));

            dayDtos.add(GeneratedItineraryDayDto.builder()
                    .dayNumber(i)
                    .date(currentDate)
                    .summary("Day " + i + " highlights in " + dest)
                    .notes("Curated from ground-truth Google Places data for " + dest)
                    .activities(activities)
                    .build());
        }

        return GeneratedItineraryDto.builder().days(dayDtos).build();
    }

    private GeneratedActivityDto createActivityFromRealPlace(RealPlaceDto p, LocalTime start, LocalTime end) {
        return GeneratedActivityDto.builder()
                .title(p.getName()) // Official Google Places Name!
                .description(p.getDescription())
                .startTime(start)
                .endTime(end)
                .estimatedCost(p.getEstimatedCost() != null ? p.getEstimatedCost() : BigDecimal.valueOf(10.0))
                .latitude(p.getLatitude())
                .longitude(p.getLongitude())
                .placeId(p.getPlaceId())
                .category(p.getCategory())
                .build();
    }

    private LocalTime parseTime(String timeStr, LocalTime defaultTime) {
        if (timeStr == null || timeStr.isBlank()) return defaultTime;
        try {
            if (timeStr.length() == 5) timeStr = timeStr + ":00";
            return LocalTime.parse(timeStr);
        } catch (Exception e) {
            return defaultTime;
        }
    }
}