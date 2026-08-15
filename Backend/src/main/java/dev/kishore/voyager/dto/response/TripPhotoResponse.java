package dev.kishore.voyager.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TripPhotoResponse {

    private Long id;

    private Long tripId;

    private String url;

    private String title;

    private String locationName;

    private LocalDateTime uploadedAt;
}
