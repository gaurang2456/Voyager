package dev.kishore.voyager.service.places;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RealPlaceDto {
    private String placeId;
    private String name;
    private String category; // "Sightseeing", "Food", "Culture", "Relaxation", "Shopping"
    private double latitude;
    private double longitude;
    private double rating;
    private BigDecimal estimatedCost;
    private String description;
}
