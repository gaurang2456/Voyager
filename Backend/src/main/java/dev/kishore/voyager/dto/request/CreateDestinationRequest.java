package dev.kishore.voyager.dto.request;

import lombok.Data;

@Data
public class CreateDestinationRequest {

    private String placeName;
    private String country;
    private Integer days;
    private String notes;
}