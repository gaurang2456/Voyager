package dev.kishore.voyager.dto.response;

import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ItineraryResponse {
    private Long id;
    private Long tripId;
    private LocalDateTime generatedAt;
    private Integer version;
    @Builder.Default
    private List<ItineraryDayResponse> days = new ArrayList<>();
}
