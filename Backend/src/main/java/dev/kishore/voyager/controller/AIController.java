package dev.kishore.voyager.controller;

import dev.kishore.voyager.service.AIItineraryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/trips")
@RequiredArgsConstructor

public class AIController {

    private final AIItineraryService aiItineraryService;

    @PostMapping("/{tripId}/generate-itinerary")
    public ResponseEntity<String> generateItinerary(
            @PathVariable Long tripId
    ) {
        return ResponseEntity.ok(
                aiItineraryService.generateItinerary(tripId)
        );
    }
}