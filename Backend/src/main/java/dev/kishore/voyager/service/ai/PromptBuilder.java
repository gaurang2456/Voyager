package dev.kishore.voyager.service.ai;

import dev.kishore.voyager.dto.weather.WeatherForecastDto;
import dev.kishore.voyager.entity.Trip;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class PromptBuilder {

    public String buildPrompt(Trip trip, List<WeatherForecastDto> weatherForecasts) {
        StringBuilder weatherSummary = new StringBuilder();
        if (weatherForecasts != null && !weatherForecasts.isEmpty()) {
            weatherSummary.append("Weather Forecast Summary:\n");
            for (WeatherForecastDto w : weatherForecasts) {
                weatherSummary.append(String.format(
                        "- Date: %s | Condition: %s | Temp: %.1f°C - %.1f°C | Rain Chance: %d%% | Wind: %.1f km/h | Humidity: %d%%\n",
                        w.getDate(), w.getCondition(), w.getMinTemperature(), w.getMaxTemperature(),
                        w.getChanceOfRain(), w.getWindSpeed(), w.getHumidity()
                ));
            }
            weatherSummary.append("\nINSTRUCTION: Adjust scheduled activities according to the weather. If rain chance is high (>50%) or weather is poor, PREFER indoor attractions, museums, or covered venues over open outdoor beaches/parks.\n\n");
        } else {
            weatherSummary.append("Weather Forecast Summary: Not available.\n\n");
        }

        return """
                You are an expert travel planner.
                
                Create a comprehensive, structured travel itinerary.
                
                Trip Details:
                - Title: %s
                - Destination: %s
                - Description: %s
                - Start Date: %s
                - End Date: %s
                - Budget: %s %s
                
                %s
                CRITICAL: You MUST return ONLY valid JSON matching the exact structure below. Do NOT wrap in markdown code blocks like ```json ... ``` or include any conversational intro/outro text.
                
                JSON Format:
                {
                  "days": [
                    {
                      "dayNumber": 1,
                      "date": "%s",
                      "summary": "Brief day summary",
                      "notes": "Day tips or notes",
                      "activities": [
                        {
                          "title": "Activity Title",
                          "description": "Activity description",
                          "startTime": "09:00:00",
                          "endTime": "11:00:00",
                          "estimatedCost": 25.50,
                          "latitude": 48.8584,
                          "longitude": 2.2945,
                          "placeId": "ChIJLU7jZClu5kcR4PcD-5ZsFCs",
                          "category": "Sightseeing"
                        }
                      ]
                    }
                  ]
                }
                """
                .formatted(
                        trip.getTitle() != null ? trip.getTitle() : "Trip",
                        trip.getDestination() != null ? trip.getDestination() : "Destination",
                        trip.getDescription() != null ? trip.getDescription() : "Vacation",
                        trip.getStartDate() != null ? trip.getStartDate().toString() : "N/A",
                        trip.getEndDate() != null ? trip.getEndDate().toString() : "N/A",
                        trip.getBudget() != null ? trip.getBudget().toString() : "0",
                        trip.getCurrency() != null ? trip.getCurrency() : "USD",
                        weatherSummary.toString(),
                        trip.getStartDate() != null ? trip.getStartDate().toString() : "2026-08-01"
                );
    }
}
