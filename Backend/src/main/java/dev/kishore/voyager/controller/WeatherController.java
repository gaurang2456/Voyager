package dev.kishore.voyager.controller;

import dev.kishore.voyager.dto.weather.WeatherForecastDto;
import dev.kishore.voyager.entity.Trip;
import dev.kishore.voyager.repository.TripRepository;
import dev.kishore.voyager.service.weather.WeatherService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trips/{tripId}/weather")
@RequiredArgsConstructor
public class WeatherController {

    private final WeatherService weatherService;
    private final TripRepository tripRepository;

    @GetMapping
    public ResponseEntity<List<WeatherForecastDto>> getWeather(@PathVariable Long tripId) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new RuntimeException("Trip not found: " + tripId));

        List<WeatherForecastDto> forecasts = weatherService.getWeatherForecast(
                trip.getDestination(),
                trip.getStartDate(),
                trip.getEndDate()
        );

        return ResponseEntity.ok(forecasts);
    }
}
