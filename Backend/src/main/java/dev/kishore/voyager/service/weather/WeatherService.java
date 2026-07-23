package dev.kishore.voyager.service.weather;

import dev.kishore.voyager.dto.weather.WeatherForecastDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
public class WeatherService {

    @Value("${weather.api.key:}")
    private String apiKey;

    private final RestClient restClient = RestClient.create();

    public List<WeatherForecastDto> getWeatherForecast(String destination, LocalDate startDate, LocalDate endDate) {
        if (apiKey != null && !apiKey.isBlank()) {
            try {
                return fetchFromWeatherApi(destination, startDate, endDate);
            } catch (Exception e) {
                log.warn("WeatherAPI call failed for {}: {}. Falling back to default forecast.", destination, e.getMessage());
            }
        }
        return generateFallbackForecast(startDate, endDate);
    }

    @SuppressWarnings("unchecked")
    private List<WeatherForecastDto> fetchFromWeatherApi(String destination, LocalDate startDate, LocalDate endDate) {
        String url = String.format("https://api.weatherapi.com/v1/forecast.json?key=%s&q=%s&days=10", apiKey, destination);
        Map<String, Object> response = restClient.get()
                .uri(url)
                .retrieve()
                .body(Map.class);

        List<WeatherForecastDto> forecasts = new ArrayList<>();
        if (response != null && response.containsKey("forecast")) {
            Map<String, Object> forecastObj = (Map<String, Object>) response.get("forecast");
            List<Map<String, Object>> forecastDays = (List<Map<String, Object>>) forecastObj.get("forecastday");

            for (Map<String, Object> dayMap : forecastDays) {
                String dateStr = (String) dayMap.get("date");
                LocalDate date = LocalDate.parse(dateStr);
                
                if ((startDate != null && date.isBefore(startDate)) || (endDate != null && date.isAfter(endDate))) {
                    continue;
                }

                Map<String, Object> dayData = (Map<String, Object>) dayMap.get("day");
                Map<String, Object> conditionMap = (Map<String, Object>) dayData.get("condition");

                Double minTemp = dayData.get("mintemp_c") != null ? ((Number) dayData.get("mintemp_c")).doubleValue() : 20.0;
                Double maxTemp = dayData.get("maxtemp_c") != null ? ((Number) dayData.get("maxtemp_c")).doubleValue() : 28.0;
                String condition = conditionMap != null && conditionMap.get("text") != null ? (String) conditionMap.get("text") : "Partly Cloudy";
                Integer chanceOfRain = dayData.get("daily_chance_of_rain") != null ? ((Number) dayData.get("daily_chance_of_rain")).intValue() : 20;
                Integer humidity = dayData.get("avghumidity") != null ? ((Number) dayData.get("avghumidity")).intValue() : 50;
                Double windSpeed = dayData.get("maxwind_kph") != null ? ((Number) dayData.get("maxwind_kph")).doubleValue() : 15.0;

                forecasts.add(WeatherForecastDto.builder()
                        .date(date)
                        .minTemperature(minTemp)
                        .maxTemperature(maxTemp)
                        .condition(condition)
                        .chanceOfRain(chanceOfRain)
                        .humidity(humidity)
                        .windSpeed(windSpeed)
                        .build());
            }
        }
        
        if (forecasts.isEmpty()) {
            return generateFallbackForecast(startDate, endDate);
        }
        return forecasts;
    }

    private List<WeatherForecastDto> generateFallbackForecast(LocalDate startDate, LocalDate endDate) {
        List<WeatherForecastDto> forecasts = new ArrayList<>();
        LocalDate start = startDate != null ? startDate : LocalDate.now();
        LocalDate end = endDate != null ? endDate : start.plusDays(3);

        int dayCount = 1;
        for (LocalDate date = start; !date.isAfter(end); date = date.plusDays(1)) {
            forecasts.add(WeatherForecastDto.builder()
                    .date(date)
                    .minTemperature(18.0 + (dayCount % 3))
                    .maxTemperature(26.0 + (dayCount % 4))
                    .condition((dayCount % 3 == 0) ? "Light Rain" : "Sunny & Clear")
                    .chanceOfRain((dayCount % 3 == 0) ? 65 : 10)
                    .humidity(55)
                    .windSpeed(12.0)
                    .build());
            dayCount++;
        }
        return forecasts;
    }
}
