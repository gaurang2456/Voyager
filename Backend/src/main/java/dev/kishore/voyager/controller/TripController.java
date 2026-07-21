package dev.kishore.voyager.controller;

import dev.kishore.voyager.dto.request.CreateTripRequest;
import dev.kishore.voyager.dto.response.TripResponse;
import dev.kishore.voyager.service.TripService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/trips")
@RequiredArgsConstructor
public class TripController {

    private final TripService tripService;

    @PostMapping
    public ResponseEntity<TripResponse> createTrip(
            @RequestBody CreateTripRequest request
    ) {
        return ResponseEntity.ok(tripService.createTrip(request));
    }
}