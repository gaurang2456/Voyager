package dev.kishore.voyager.dto.request;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class UpdateTripRequest {

    private String destination;

    private LocalDate startDate;

    private LocalDate endDate;

    private BigDecimal budget;

    private String description;
}