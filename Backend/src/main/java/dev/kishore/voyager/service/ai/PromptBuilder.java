package dev.kishore.voyager.service.ai;

import dev.kishore.voyager.dto.weather.WeatherForecastDto;
import dev.kishore.voyager.entity.Trip;
import dev.kishore.voyager.service.places.RealPlaceDto;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class PromptBuilder {

    public String buildPrompt(Trip trip, List<RealPlaceDto> candidatePlaces, List<WeatherForecastDto> weatherForecasts, String userInstruction) {
        String destName = trip.getDestination() != null ? trip.getDestination() : "Destination";

        StringBuilder placesListText = new StringBuilder();
        placesListText.append("CANDIDATE GOOGLE PLACES IN ").append(destName.toUpperCase()).append(":\n");
        for (int i = 0; i < candidatePlaces.size(); i++) {
            RealPlaceDto p = candidatePlaces.get(i);
            placesListText.append(String.format(
                    "- placeId: \"%s\" | Name: \"%s\" | Category: %s | Rating: %.1f\n",
                    p.getPlaceId(), p.getName(), p.getCategory(), p.getRating()
            ));
        }

        StringBuilder weatherSummary = new StringBuilder();
        if (weatherForecasts != null && !weatherForecasts.isEmpty()) {
            weatherSummary.append("\nWeather Summary:\n");
            for (WeatherForecastDto w : weatherForecasts) {
                weatherSummary.append(String.format(
                        "- Date: %s | Condition: %s | Rain Chance: %d%%\n",
                        w.getDate(), w.getCondition(), w.getChanceOfRain()
                ));
            }
        }

        if (userInstruction != null && !userInstruction.isBlank()) {
            weatherSummary.append("\nUser Request: \"").append(userInstruction).append("\"\n");
        }

        return """
                You are a travel itinerary optimizer for Voyager.
                
                STRICT MANDATE:
                1. You MUST select activities ONLY from the provided candidate 'placeId' list below.
                2. Do NOT invent, fabricate, or output any place names, coordinates, or costs.
                3. Your response MUST reference candidate places ONLY by their exact 'placeId' string.
                4. CRITICAL UNIQUE PLACES MANDATE: Do NOT repeat any placeId or venue. Every activity across all days MUST have a UNIQUE placeId. Each candidate placeId must be used AT MOST ONCE across the entire trip.
                
                Destination: %s
                Trip Dates: %s to %s
                Budget: %s %s
                
                %s
                
                %s
                
                OUTPUT FORMAT (JSON ONLY):
                Return ONLY valid JSON matching the exact structure below. Do NOT wrap in markdown code blocks.
                
                {
                  "days": [
                    {
                      "dayNumber": 1,
                      "date": "%s",
                      "summary": "Day 1 Summary",
                      "notes": "Tips for Day 1",
                      "activities": [
                        {
                          "placeId": "place-ktm-boudha",
                          "startTime": "09:30:00",
                          "endTime": "11:30:00"
                        }
                      ]
                    }
                  ]
                }
                """
                .formatted(
                        destName,
                        trip.getStartDate() != null ? trip.getStartDate().toString() : "N/A",
                        trip.getEndDate() != null ? trip.getEndDate().toString() : "N/A",
                        trip.getBudget() != null ? trip.getBudget().toString() : "0",
                        trip.getCurrency() != null ? trip.getCurrency() : "USD",
                        placesListText.toString(),
                        weatherSummary.toString(),
                        trip.getStartDate() != null ? trip.getStartDate().toString() : "2026-10-12"
                );
    }
}
