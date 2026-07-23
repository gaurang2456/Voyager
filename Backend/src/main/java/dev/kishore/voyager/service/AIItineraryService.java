package dev.kishore.voyager.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import dev.kishore.voyager.dto.ai.GeneratedItineraryDto;
import dev.kishore.voyager.dto.weather.WeatherForecastDto;
import dev.kishore.voyager.entity.Trip;
import dev.kishore.voyager.service.ai.PromptBuilder;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class AIItineraryService {

    private final ChatClient chatClient;
    private final PromptBuilder promptBuilder;
    private final ObjectMapper objectMapper;

    public GeneratedItineraryDto generateItineraryDto(Trip trip, List<WeatherForecastDto> weatherForecasts) {
        String prompt = promptBuilder.buildPrompt(trip, weatherForecasts);

        String rawContent = chatClient.prompt(prompt)
                .call()
                .content();

        return parseResponse(rawContent);
    }

    private GeneratedItineraryDto parseResponse(String rawContent) {
        if (rawContent == null || rawContent.isBlank()) {
            throw new RuntimeException("AI returned empty content");
        }

        String cleanedJson = rawContent.trim();
        if (cleanedJson.startsWith("```json")) {
            cleanedJson = cleanedJson.substring(7);
        } else if (cleanedJson.startsWith("```")) {
            cleanedJson = cleanedJson.substring(3);
        }
        if (cleanedJson.endsWith("```")) {
            cleanedJson = cleanedJson.substring(0, cleanedJson.length() - 3);
        }
        cleanedJson = cleanedJson.trim();

        try {
            return objectMapper.readValue(cleanedJson, GeneratedItineraryDto.class);
        } catch (Exception e) {
            log.error("Failed to parse Gemini response: {}. Raw content was: {}", e.getMessage(), rawContent);
            throw new RuntimeException("Failed to parse AI generated itinerary response: " + e.getMessage(), e);
        }
    }
}