package dev.kishore.voyager.dto.weather;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WeatherForecastDto {
    private LocalDate date;
    private Double minTemperature;
    private Double maxTemperature;
    private String condition;
    private Integer chanceOfRain;
    private Integer humidity;
    private Double windSpeed;
}
