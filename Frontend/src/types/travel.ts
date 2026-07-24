export type ActivityCategory = 'sightseeing' | 'food' | 'shopping' | 'hotel';
export type PriorityLevel = 'high' | 'medium' | 'low';
export type ActivityStatus = 'completed' | 'current' | 'upcoming' | 'skipped' | 'replaced';

export interface Activity {
  id: string;
  order: number;
  time: string;
  title: string;
  category: ActivityCategory;
  priority: PriorityLevel;
  description: string;
  estimatedCost: number;
  weatherSuitability: string;
  lat: number;
  lng: number;
  locationName: string;
  status: ActivityStatus;
  durationMinutes: number;
  rating?: number;
  imageUrl?: string;
}

export interface DayItinerary {
  dayNumber: number;
  date: string;
  title: string;
  activities: Activity[];
}

export interface WeatherInfo {
  temperature: string;
  condition: string;
  rainProbability: string;
  aiRecommendation: string;
  icon: string;
}

export interface Trip {
  id: string;
  destination: string;
  country: string;
  dates: string;
  totalBudget: number;
  spentBudget: number;
  weather: WeatherInfo;
  days: DayItinerary[];
}

export interface AICommand {
  id: string;
  text: string;
  timestamp: string;
  type: 'replace' | 'budget' | 'route' | 'add' | 'general';
}
