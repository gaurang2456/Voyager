package dev.kishore.voyager.controller;

import dev.kishore.voyager.dto.request.CreateDestinationRequest;
import dev.kishore.voyager.dto.request.UpdateDestinationRequest;
import dev.kishore.voyager.dto.response.DestinationResponse;
import dev.kishore.voyager.service.DestinationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trips/{tripId}/destinations")
@RequiredArgsConstructor
public class DestinationController {

    private final DestinationService destinationService;

    @PostMapping
    public ResponseEntity<DestinationResponse> createDestination(
            @PathVariable Long tripId,
            @RequestBody CreateDestinationRequest request
    ) {

        return ResponseEntity.ok(
                destinationService.createDestination(tripId, request)
        );
    }

    @GetMapping
    public ResponseEntity<List<DestinationResponse>> getDestinations(
            @PathVariable Long tripId
    ) {

        return ResponseEntity.ok(
                destinationService.getDestinations(tripId)
        );
    }

    @GetMapping("/{destinationId}")
    public ResponseEntity<DestinationResponse> getDestination(
            @PathVariable Long tripId,
            @PathVariable Long destinationId
    ) {

        return ResponseEntity.ok(
                destinationService.getDestination(tripId, destinationId)
        );
    }

    @PutMapping("/{destinationId}")
    public ResponseEntity<DestinationResponse> updateDestination(
            @PathVariable Long tripId,
            @PathVariable Long destinationId,
            @RequestBody UpdateDestinationRequest request
    ) {

        return ResponseEntity.ok(
                destinationService.updateDestination(
                        tripId,
                        destinationId,
                        request
                )
        );
    }

    @DeleteMapping("/{destinationId}")
    public ResponseEntity<Void> deleteDestination(
            @PathVariable Long tripId,
            @PathVariable Long destinationId
    ) {

        destinationService.deleteDestination(tripId, destinationId);

        return ResponseEntity.noContent().build();
    }
}