package dev.kishore.voyager.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DestinationResponse {

    private Long id;
    private String placeName;
    private String country;
    private Integer days;
    private String notes;
}