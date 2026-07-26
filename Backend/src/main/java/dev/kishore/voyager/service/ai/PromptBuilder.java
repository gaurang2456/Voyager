package dev.kishore.voyager.service.ai;

import dev.kishore.voyager.dto.weather.WeatherForecastDto;
import dev.kishore.voyager.entity.Trip;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class PromptBuilder {

    public String buildPrompt(Trip trip, List<WeatherForecastDto> weatherForecasts) {
        return buildPrompt(trip, weatherForecasts, null);
    }

    public String buildPrompt(Trip trip, List<WeatherForecastDto> weatherForecasts, String userInstruction) {
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

        if (userInstruction != null && !userInstruction.isBlank()) {
            weatherSummary.append("USER CUSTOM INSTRUCTION / MODIFICATION REQUEST:\n");
            weatherSummary.append("\"").append(userInstruction).append("\"\n");
            weatherSummary.append("Please strictly apply this custom user request to tailor the itinerary activities.\n\n");
        }

        String destName = trip.getDestination() != null ? trip.getDestination() : "Destination";

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
                
                CRITICAL DESTINATION GEOCODING & CITY RESOLUTION RULES:
                1. Always resolve "%s" as an administrative CITY/MUNICIPALITY (e.g. Mumbai, Maharashtra, India; Delhi, India; Paris, France; Tokyo, Japan).
                2. NEVER resolve the trip destination to a shop, restaurant, hotel, or business named after the city.
                3. ALL activity latitudes and longitudes MUST be accurate geographic coordinates located within a 15km radius of the administrative city center of %s.
                
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
                          "latitude": 19.0760,
                          "longitude": 72.8777,
                          "placeId": "place_id_string",
                          "category": "Sightseeing"
                        }
                      ]
                    }
                  ]
                }
                """
                .formatted(
                        trip.getTitle() != null ? trip.getTitle() : "Trip",
                        destName,
                        trip.getDescription() != null ? trip.getDescription() : "Vacation",
                        trip.getStartDate() != null ? trip.getStartDate().toString() : "N/A",
                        trip.getEndDate() != null ? trip.getEndDate().toString() : "N/A",
                        trip.getBudget() != null ? trip.getBudget().toString() : "0",
                        trip.getCurrency() != null ? trip.getCurrency() : "USD",
                        destName,
                        destName,
                        weatherSummary.toString(),
                        trip.getStartDate() != null ? trip.getStartDate().toString() : "2026-10-12"
                );
    }
}
