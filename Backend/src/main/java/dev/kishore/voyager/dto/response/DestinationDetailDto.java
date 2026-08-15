package dev.kishore.voyager.dto.response;

import dev.kishore.voyager.service.places.RealPlaceDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DestinationDetailDto {
    private String name;
    private String country;
    private String region;
    private String tagline;
    private String description;
    private String heroImage;
    private String bestTimeToVisit;
    private String currency;
    private BigDecimal avgDailyCost;
    private Double rating;
    private List<String> popularStyles;
    private List<RealPlaceDto> places;
    private List<DestinationSearchSuggestionDto> hotels;
    private List<DestinationSearchSuggestionDto> experiences;
}
