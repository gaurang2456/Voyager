package dev.kishore.voyager.dto.ai;

import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GeneratedItineraryDto {
    private String modificationSummary;

    @Builder.Default
    private List<GeneratedItineraryDayDto> days = new ArrayList<>();
}
