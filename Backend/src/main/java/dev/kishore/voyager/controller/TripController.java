package dev.kishore.voyager.controller;

import dev.kishore.voyager.dto.request.CreateTripRequest;
import dev.kishore.voyager.dto.request.UpdateTripRequest;
import dev.kishore.voyager.dto.response.TripResponse;
import dev.kishore.voyager.service.TripService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    @GetMapping
    public ResponseEntity<List<TripResponse>> getMyTrips() {

        return ResponseEntity.ok(
                tripService.getMyTrips()
        );
    }
    @GetMapping("/{id}")
    public ResponseEntity<TripResponse> getTripById(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                tripService.getTripById(id)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<TripResponse> updateTrip(
            @PathVariable Long id,
            @RequestBody UpdateTripRequest request
    ) {

        return ResponseEntity.ok(
                tripService.updateTrip(id, request)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTrip(@PathVariable Long id) {

        tripService.deleteTrip(id);

        return ResponseEntity.noContent().build();
    }
}