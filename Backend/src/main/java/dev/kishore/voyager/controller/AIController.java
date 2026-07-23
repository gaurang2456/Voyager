package dev.kishore.voyager.controller;

import dev.kishore.voyager.dto.response.ItineraryResponse;
import dev.kishore.voyager.service.ItineraryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/trips")
@RequiredArgsConstructor
public class AIController {

    private final ItineraryService itineraryService;

    @PostMapping("/{tripId}/generate-itinerary")
    public ResponseEntity<ItineraryResponse> generateItinerary(
            @PathVariable Long tripId
    ) {
        return ResponseEntity.ok(
                itineraryService.generateItinerary(tripId)
        );
    }
}