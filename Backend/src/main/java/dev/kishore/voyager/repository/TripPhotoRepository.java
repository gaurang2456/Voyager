package dev.kishore.voyager.repository;

import dev.kishore.voyager.entity.TripPhoto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TripPhotoRepository extends JpaRepository<TripPhoto, Long> {

    List<TripPhoto> findByTripIdAndUserEmailOrderByUploadedAtDesc(Long tripId, String userEmail);

    List<TripPhoto> findByUserEmail(String userEmail);

    long countByTripIdAndUserEmail(Long tripId, String userEmail);

    Optional<TripPhoto> findByIdAndTripIdAndUserEmail(Long id, Long tripId, String userEmail);
}
