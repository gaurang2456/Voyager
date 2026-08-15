package dev.kishore.voyager.service;

import dev.kishore.voyager.dto.request.TripPhotoRequest;
import dev.kishore.voyager.dto.response.TripPhotoResponse;
import dev.kishore.voyager.entity.Trip;
import dev.kishore.voyager.entity.TripPhoto;
import dev.kishore.voyager.entity.User;
import dev.kishore.voyager.repository.TripPhotoRepository;
import dev.kishore.voyager.repository.TripRepository;
import dev.kishore.voyager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TripPhotoService {

    private final TripPhotoRepository tripPhotoRepository;
    private final TripRepository tripRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<TripPhotoResponse> getPhotosForTrip(Long tripId, String userEmail) {
        // Verify trip ownership
        Trip trip = tripRepository.findByIdAndUserEmail(tripId, userEmail)
                .orElseThrow(() -> new RuntimeException("Trip not found or unauthorized access"));

        return tripPhotoRepository.findByTripIdAndUserEmailOrderByUploadedAtDesc(tripId, userEmail)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional
    public TripPhotoResponse addPhotoToTrip(Long tripId, TripPhotoRequest request, String userEmail) {
        Trip trip = tripRepository.findByIdAndUserEmail(tripId, userEmail)
                .orElseThrow(() -> new RuntimeException("Trip not found or unauthorized access"));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String title = request.getTitle() != null && !request.getTitle().isBlank()
                ? request.getTitle().trim()
                : trip.getDestination() + " Photo";

        String location = request.getLocationName() != null && !request.getLocationName().isBlank()
                ? request.getLocationName().trim()
                : trip.getDestination();

        TripPhoto photo = TripPhoto.builder()
                .url(request.getUrl())
                .title(title)
                .locationName(location)
                .uploadedAt(LocalDateTime.now())
                .trip(trip)
                .user(user)
                .build();

        TripPhoto savedPhoto = tripPhotoRepository.save(photo);
        return mapToResponse(savedPhoto);
    }

    @Transactional
    public void deletePhoto(Long tripId, Long photoId, String userEmail) {
        TripPhoto photo = tripPhotoRepository.findByIdAndTripIdAndUserEmail(photoId, tripId, userEmail)
                .orElseThrow(() -> new RuntimeException("Photo not found or unauthorized access"));

        tripPhotoRepository.delete(photo);
    }

    private TripPhotoResponse mapToResponse(TripPhoto photo) {
        return TripPhotoResponse.builder()
                .id(photo.getId())
                .tripId(photo.getTrip().getId())
                .url(photo.getUrl())
                .title(photo.getTitle())
                .locationName(photo.getLocationName())
                .uploadedAt(photo.getUploadedAt())
                .build();
    }
}
