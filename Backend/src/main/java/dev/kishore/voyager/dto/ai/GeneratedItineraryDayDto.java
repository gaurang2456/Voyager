package dev.kishore.voyager.dto.ai;

import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GeneratedItineraryDayDto {
    private Integer dayNumber;
    private LocalDate date;
    private String summary;
    private String notes;
    @Builder.Default
    private List<GeneratedActivityDto> activities = new ArrayList<>();
}
