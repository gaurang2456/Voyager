import { apiClient } from '../services/axios';
import type { WeatherForecastDto } from '../types/dto';
import type { WeatherInfo } from '../types/travel';

export async function fetchTripWeatherApi(tripId: number | string): Promise<WeatherForecastDto[]> {
  try {
    const response = await apiClient.get<WeatherForecastDto[]>(`/api/trips/${tripId}/weather`);
    return response.data;
  } catch (error) {
    console.warn(`Weather API call failed for trip ${tripId}, using default weather info`);
    return [];
  }
}

export function transformForecastToWeatherInfo(forecasts: WeatherForecastDto[]): WeatherInfo {
  if (!forecasts || forecasts.length === 0) {
    return {
      temperature: '22°C',
      condition: 'Partly Cloudy',
      rainProbability: '15% Rain',
      aiRecommendation: 'Great conditions for outdoor walk. Light jacket recommended.',
      icon: 'partly-cloudy',
    };
  }

  const today = forecasts[0];
  const avgTemp = Math.round((today.minTemperature + today.maxTemperature) / 2);
  const condition = today.condition || 'Partly Cloudy';
  const rainProb = `${today.chanceOfRain ?? 15}% Rain`;

  let aiRec = `Pleasant conditions around ${avgTemp}°C. Perfect weather for exploration.`;
  if ((today.chanceOfRain ?? 0) > 50) {
    aiRec = 'High chance of rain today. Indoor attractions & covered venues recommended.';
  } else if (avgTemp > 28) {
    aiRec = 'Warm & sunny! Stay hydrated and enjoy shaded parks or indoor spots.';
  }

  let icon = 'partly-cloudy';
  const condLower = condition.toLowerCase();
  if (condLower.includes('rain') || condLower.includes('shower') || condLower.includes('drizzle')) {
    icon = 'rainy';
  } else if (condLower.includes('sun') || condLower.includes('clear')) {
    icon = 'sunny';
  }

  return {
    temperature: `${avgTemp}°C`,
    condition,
    rainProbability: rainProb,
    aiRecommendation: aiRec,
    icon,
  };
}
