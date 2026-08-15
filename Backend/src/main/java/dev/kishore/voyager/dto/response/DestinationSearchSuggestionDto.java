package dev.kishore.voyager.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DestinationSearchSuggestionDto {
    private String id;
    private String title;
    private String subtitle;
    private String type; // "destination", "hotel", "experience"
    private String destinationName;
    private String imageUrl;
    private Double rating;
    private String priceRange;
}
