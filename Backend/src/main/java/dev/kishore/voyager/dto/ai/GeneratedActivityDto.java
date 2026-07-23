package dev.kishore.voyager.dto.ai;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GeneratedActivityDto {
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
