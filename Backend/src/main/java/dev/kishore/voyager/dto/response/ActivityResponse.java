package dev.kishore.voyager.dto.response;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActivityResponse {
    private Long id;
    private String title;
    private String description;
    private LocalTime startTime;
    private LocalTime endTime;
    private BigDecimal estimatedCost;
    private Double latitude;
    private Double longitude;
    private String placeId;
    private String category;
}
