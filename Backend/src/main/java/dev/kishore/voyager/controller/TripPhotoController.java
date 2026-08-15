package dev.kishore.voyager.controller;

import dev.kishore.voyager.dto.request.TripPhotoRequest;
import dev.kishore.voyager.dto.response.TripPhotoResponse;
import dev.kishore.voyager.service.TripPhotoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trips/{tripId}/photos")
@RequiredArgsConstructor
public class TripPhotoController {

    private final TripPhotoService tripPhotoService;

    @GetMapping
    public ResponseEntity<List<TripPhotoResponse>> getPhotos(
            @PathVariable Long tripId,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        List<TripPhotoResponse> photos = tripPhotoService.getPhotosForTrip(tripId, userDetails.getUsername());
        return ResponseEntity.ok(photos);
    }

    @PostMapping
    public ResponseEntity<TripPhotoResponse> addPhoto(
            @PathVariable Long tripId,
            @RequestBody TripPhotoRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        TripPhotoResponse photo = tripPhotoService.addPhotoToTrip(tripId, request, userDetails.getUsername());
        return ResponseEntity.ok(photo);
    }

    @DeleteMapping("/{photoId}")
    public ResponseEntity<Void> deletePhoto(
            @PathVariable Long tripId,
            @PathVariable Long photoId,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        tripPhotoService.deletePhoto(tripId, photoId, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }
}
