export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

export interface TripResponse {
  id: number;
  destination: string;
  title?: string;
  currency?: string;
  startDate?: string;
  endDate?: string;
  budget?: number;
  description?: string;
}

export interface CreateTripRequest {
  destination: string;
  title?: string;
  currency?: string;
  startDate: string;
  endDate: string;
  budget: number;
  description?: string;
}

export interface UpdateTripRequest {
  destination?: string;
  title?: string;
  currency?: string;
  startDate?: string;
  endDate?: string;
  budget?: number;
  description?: string;
}

export interface ActivityResponse {
  id: number;
  title: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  estimatedCost?: number;
  latitude: number;
  longitude: number;
  placeId?: string;
  category?: string;
}

export interface ItineraryDayResponse {
  id: number;
  dayNumber: number;
  date?: string;
  summary?: string;
  notes?: string;
  activities: ActivityResponse[];
}

export interface ItineraryResponse {
  id: number;
  tripId: number;
  generatedAt?: string;
  version?: number;
  modificationSummary?: string;
  days: ItineraryDayResponse[];
}

export interface WeatherForecastDto {
  date: string;
  minTemperature: number;
  maxTemperature: number;
  condition?: string;
  chanceOfRain?: number;
  humidity?: number;
  windSpeed?: number;
}
