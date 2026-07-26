package dev.kishore.voyager.dto.ai;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

public class GeminiSelectionDtos {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GeminiItinerarySelectionDto {
        private List<GeminiDaySelectionDto> days;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GeminiDaySelectionDto {
        private int dayNumber;
        private String date;
        private String summary;
        private String notes;
        private List<GeminiActivitySelectionDto> activities;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GeminiActivitySelectionDto {
        private String placeId;
        private String startTime;
        private String endTime;
    }
}
