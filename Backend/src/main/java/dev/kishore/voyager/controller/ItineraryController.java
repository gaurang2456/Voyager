package dev.kishore.voyager.controller;

import dev.kishore.voyager.dto.response.ItineraryResponse;
import dev.kishore.voyager.service.ItineraryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/trips/{tripId}/itinerary")
@RequiredArgsConstructor
public class ItineraryController {

    private final ItineraryService itineraryService;

    @PostMapping("/generate")
    public ResponseEntity<ItineraryResponse> generateItinerary(
            @PathVariable Long tripId
    ) {
        return ResponseEntity.ok(itineraryService.generateItinerary(tripId));
    }

    @GetMapping
    public ResponseEntity<ItineraryResponse> getItinerary(
            @PathVariable Long tripId
    ) {
        return ResponseEntity.ok(itineraryService.getItinerary(tripId));
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteItinerary(
            @PathVariable Long tripId
    ) {
        itineraryService.deleteItinerary(tripId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/regenerate")
    public ResponseEntity<ItineraryResponse> regenerateItinerary(
            @PathVariable Long tripId
    ) {
        return ResponseEntity.ok(itineraryService.regenerateItinerary(tripId));
    }
}
