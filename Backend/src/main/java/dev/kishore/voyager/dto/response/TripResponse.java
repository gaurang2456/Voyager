package dev.kishore.voyager.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
public class TripResponse {

    private Long id;

    private String destination;

    private LocalDate startDate;

    private LocalDate endDate;

    private BigDecimal budget;

    private String description;
}