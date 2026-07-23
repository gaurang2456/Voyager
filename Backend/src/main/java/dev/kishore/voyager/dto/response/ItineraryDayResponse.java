package dev.kishore.voyager.dto.response;

import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ItineraryDayResponse {
    private Long id;
    private Integer dayNumber;
    private LocalDate date;
    private String summary;
    private String notes;
    @Builder.Default
    private List<ActivityResponse> activities = new ArrayList<>();
}
