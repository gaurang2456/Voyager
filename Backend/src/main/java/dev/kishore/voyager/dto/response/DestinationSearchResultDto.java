package dev.kishore.voyager.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DestinationSearchResultDto {
    private String query;
    private List<DestinationSearchSuggestionDto> destinations;
    private List<DestinationSearchSuggestionDto> hotels;
    private List<DestinationSearchSuggestionDto> experiences;
}
