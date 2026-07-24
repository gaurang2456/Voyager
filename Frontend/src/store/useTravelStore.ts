import { create } from 'zustand';
import type { Trip, Activity, ActivityCategory, ActivityStatus } from '../types/travel';

const initialTrips: Trip[] = [
  {
    id: 'tokyo-2026',
    destination: 'Tokyo',
    country: 'Japan',
    dates: 'Oct 12 – Oct 18, 2026',
    totalBudget: 2000,
    spentBudget: 580,
    weather: {
      temperature: '22°C',
      condition: 'Partly Cloudy',
      rainProbability: '15% Rain',
      aiRecommendation: 'Outdoor itinerary retained due to clear weather. Strolls scheduled during mild afternoon.',
      icon: 'partly-cloudy',
    },
    days: [
      {
        dayNumber: 1,
        date: 'Oct 12, 2026',
        title: 'Shinjuku & Shibuya Heartbeat',
        activities: [
          {
            id: 'act-1',
            order: 1,
            time: '09:30',
            title: 'Meiji Jingu Shrine Walk',
            category: 'sightseeing',
            priority: 'high',
            description: 'Tranquil walk through lush forest leads to iconic Shinto shrine gate and historic courtyard.',
            estimatedCost: 0,
            weatherSuitability: '☀️ Ideal for morning stroll',
            lat: 35.6764,
            lng: 139.6993,
            locationName: 'Meiji Shrine, Shibuya',
            status: 'completed',
            durationMinutes: 90,
            rating: 4.8,
          },
          {
            id: 'act-2',
            order: 2,
            time: '12:30',
            title: 'Ichiran Ramen Experience',
            category: 'food',
            priority: 'high',
            description: 'Customizable solo booth Tonkotsu ramen with rich broth, secret chili sauce & matcha pudding.',
            estimatedCost: 18,
            weatherSuitability: '🍜 Cozy indoor seating',
            lat: 35.6618,
            lng: 139.7005,
            locationName: 'Jinnan, Shibuya',
            status: 'current',
            durationMinutes: 60,
            rating: 4.7,
          },
          {
            id: 'act-3',
            order: 3,
            time: '15:00',
            title: 'Shibuya Parco & Cat Street',
            category: 'shopping',
            priority: 'medium',
            description: 'Explore Nintendo World, Pokemon Center, high-end Japanese street fashion and cafes.',
            estimatedCost: 120,
            weatherSuitability: '🛍️ Perfect indoor & boutique stroll',
            lat: 35.6622,
            lng: 139.6986,
            locationName: 'Shibuya Parco',
            status: 'upcoming',
            durationMinutes: 120,
            rating: 4.6,
          },
          {
            id: 'act-4',
            order: 4,
            time: '19:00',
            title: 'Hotel Gracery Shinjuku Check-in',
            category: 'hotel',
            priority: 'high',
            description: 'Iconic Godzilla view tower hotel in the vibrant neon center of Kabukicho.',
            estimatedCost: 180,
            weatherSuitability: '🏨 Hotel check-in & lounge',
            lat: 35.6953,
            lng: 139.7022,
            locationName: 'Kabukicho, Shinjuku',
            status: 'upcoming',
            durationMinutes: 45,
            rating: 4.5,
          },
        ],
      },
      {
        dayNumber: 2,
        date: 'Oct 13, 2026',
        title: 'Asakusa & Modern Skyline',
        activities: [
          {
            id: 'act-5',
            order: 1,
            time: '09:00',
            title: 'Senso-ji Temple Walk',
            category: 'sightseeing',
            priority: 'high',
            description: 'Tokyo’s oldest temple with traditional street stalls selling melonpan, fans, and matcha.',
            estimatedCost: 15,
            weatherSuitability: '🌤️ Outdoor heritage walk',
            lat: 35.7148,
            lng: 139.7967,
            status: 'upcoming',
            durationMinutes: 100,
            rating: 4.9,
            locationName: 'Asakusa, Taito',
          },
          {
            id: 'act-6',
            order: 2,
            time: '12:30',
            title: 'Tempura Daikokuya Lunch',
            category: 'food',
            priority: 'medium',
            description: 'Authentic crunchy sesame tempura bowl with dark savory tendon sauce.',
            estimatedCost: 28,
            weatherSuitability: '🍱 Indoor traditional dining',
            lat: 35.7121,
            lng: 139.7942,
            status: 'upcoming',
            durationMinutes: 75,
            rating: 4.6,
            locationName: 'Asakusa',
          },
          {
            id: 'act-7',
            order: 3,
            time: '16:00',
            title: 'Tokyo Skytree Deck',
            category: 'sightseeing',
            priority: 'high',
            description: 'Panoramas from 450m high observing Mt. Fuji and the city grid at dusk.',
            estimatedCost: 32,
            weatherSuitability: '🔭 High visibility recommended',
            lat: 35.7101,
            lng: 139.8107,
            status: 'upcoming',
            durationMinutes: 120,
            rating: 4.8,
            locationName: 'Oshiage, Sumida',
          },
        ],
      },
      {
        dayNumber: 3,
        date: 'Oct 14, 2026',
        title: 'Digital Art & Waterfront',
        activities: [
          {
            id: 'act-8',
            order: 1,
            time: '10:00',
            title: 'teamLab Planets Museum',
            category: 'sightseeing',
            priority: 'high',
            description: 'Immersive body-on digital art museum walking barefoot through water and light.',
            estimatedCost: 38,
            weatherSuitability: '✨ Indoor rainproof immersion',
            lat: 35.6491,
            lng: 139.7898,
            status: 'upcoming',
            durationMinutes: 150,
            rating: 4.9,
            locationName: 'Toyosu, Koto',
          },
          {
            id: 'act-9',
            order: 2,
            time: '13:30',
            title: 'Toyosu Fish Market Omakase',
            category: 'food',
            priority: 'high',
            description: 'Ultra-fresh morning catch nigiri set prepared live by master chef.',
            estimatedCost: 85,
            weatherSuitability: '🍣 Indoor gourmet experience',
            lat: 35.6444,
            lng: 139.7828,
            status: 'upcoming',
            durationMinutes: 90,
            rating: 4.9,
            locationName: 'Toyosu Market',
          },
        ],
      },
    ],
  },
  {
    id: 'paris-2026',
    destination: 'Paris',
    country: 'France',
    dates: 'Nov 04 – Nov 10, 2026',
    totalBudget: 2800,
    spentBudget: 940,
    weather: {
      temperature: '16°C',
      condition: 'Mild Breeze',
      rainProbability: '5% Rain',
      aiRecommendation: 'Rain expected after 3 PM. Indoor attractions and museums moved to the afternoon.',
      icon: 'sunny',
    },
    days: [
      {
        dayNumber: 1,
        date: 'Nov 04, 2026',
        title: 'Louvre & Seine Reverie',
        activities: [
          {
            id: 'p-1',
            order: 1,
            time: '09:30',
            title: 'Louvre Museum Masterpieces',
            category: 'sightseeing',
            priority: 'high',
            description: 'Mona Lisa, Winged Victory, and grand French royal galleries.',
            estimatedCost: 22,
            weatherSuitability: '🏛️ Indoor museum marvel',
            lat: 48.8606,
            lng: 2.3376,
            status: 'current',
            durationMinutes: 180,
            rating: 4.9,
            locationName: '1st Arrondissement, Paris',
          },
          {
            id: 'p-2',
            order: 2,
            time: '13:30',
            title: 'Café de Flore Bistro Lunch',
            category: 'food',
            priority: 'medium',
            description: 'Classic Saint-Germain hot chocolate, croque monsieur & sidewalk watching.',
            estimatedCost: 45,
            weatherSuitability: '☕ Outdoor covered patio',
            lat: 48.8542,
            lng: 2.3331,
            status: 'upcoming',
            durationMinutes: 75,
            rating: 4.6,
            locationName: 'Saint-Germain-des-Prés',
          },
        ],
      },
    ],
  },
];

export interface TravelState {
  trips: Trip[];
  activeTripId: string;
  activeDayNumber: number;
  selectedActivityId: string | null;
  hoveredActivityId: string | null;
  isPanelOpen: boolean;
  filterCategory: ActivityCategory | 'all';
  searchQuery: string;

  setActiveTrip: (tripId: string) => void;
  setActiveDay: (dayNumber: number) => void;
  setSelectedActivity: (activityId: string | null) => void;
  setHoveredActivity: (activityId: string | null) => void;
  setPanelOpen: (isOpen: boolean) => void;
  setFilterCategory: (category: ActivityCategory | 'all') => void;
  setSearchQuery: (query: string) => void;

  skipActivity: (activityId: string) => void;
  replaceActivity: (activityId: string, newActivityTitle?: string) => void;
  addActivity: (activity: Partial<Activity>) => void;
  executeAiCommand: (commandText: string) => string;
}

export const useTravelStore = create<TravelState>((set, get) => ({
  trips: initialTrips,
  activeTripId: 'tokyo-2026',
  activeDayNumber: 1,
  selectedActivityId: 'act-2',
  hoveredActivityId: null,
  isPanelOpen: true,
  filterCategory: 'all',
  searchQuery: '',

  setActiveTrip: (tripId: string) => set({ activeTripId: tripId, activeDayNumber: 1, selectedActivityId: null }),
  setActiveDay: (dayNumber: number) => set({ activeDayNumber: dayNumber }),
  setSelectedActivity: (activityId: string | null) => {
    if (!activityId) {
      set({ selectedActivityId: null, isPanelOpen: false });
      return;
    }
    const { trips, activeTripId } = get();
    // Update progress status of selected activity to current, past to completed, future to upcoming
    const updatedTrips = trips.map((trip: Trip) => {
      if (trip.id !== activeTripId) return trip;
      return {
        ...trip,
        days: trip.days.map((day) => {
          const targetIndex = day.activities.findIndex((a) => a.id === activityId);
          if (targetIndex === -1) return day;
          return {
            ...day,
            activities: day.activities.map((act: Activity, idx: number) => {
              if (act.status === 'skipped' || act.status === 'replaced') return act;
              if (idx < targetIndex) return { ...act, status: 'completed' as ActivityStatus };
              if (idx === targetIndex) return { ...act, status: 'current' as ActivityStatus };
              return { ...act, status: 'upcoming' as ActivityStatus };
            }),
          };
        }),
      };
    });
    set({ trips: updatedTrips, selectedActivityId: activityId, isPanelOpen: true });
  },
  setHoveredActivity: (activityId: string | null) => set({ hoveredActivityId: activityId }),
  setPanelOpen: (isOpen: boolean) => set({ isPanelOpen: isOpen }),
  setFilterCategory: (category: ActivityCategory | 'all') => set({ filterCategory: category }),
  setSearchQuery: (query: string) => set({ searchQuery: query }),

  skipActivity: (activityId: string) => {
    const { trips, activeTripId } = get();
    const updatedTrips: Trip[] = trips.map((trip: Trip) => {
      if (trip.id !== activeTripId) return trip;
      return {
        ...trip,
        days: trip.days.map((day) => ({
          ...day,
          activities: day.activities.map((act: Activity) => {
            if (act.id === activityId) {
              const newStatus: ActivityStatus = act.status === 'skipped' ? 'upcoming' : 'skipped';
              return { ...act, status: newStatus };
            }
            return act;
          }),
        })),
      };
    });
    set({ trips: updatedTrips });
  },

  replaceActivity: (activityId: string, newTitle?: string) => {
    const { trips, activeTripId } = get();
    const replacements = [
      {
        title: 'Nezu Museum & Zen Garden',
        category: 'sightseeing' as ActivityCategory,
        description: 'Serene Japanese bamboo gardens & tea ceremony gallery.',
        cost: 16,
        weather: '🌿 Calm garden path',
      },
      {
        title: 'Roppongi Hills Observatory',
        category: 'sightseeing' as ActivityCategory,
        description: 'Panoramic roof deck overlooking Tokyo Tower.',
        cost: 25,
        weather: '🌇 Sunset viewpoint',
      },
      {
        title: 'Ginza Roof Izakaya',
        category: 'food' as ActivityCategory,
        description: 'Craft cocktails and yakitori under city sky.',
        cost: 40,
        weather: '🍹 Evening lounge',
      },
    ];

    const pick = replacements[Math.floor(Math.random() * replacements.length)];

    const updatedTrips: Trip[] = trips.map((trip: Trip) => {
      if (trip.id !== activeTripId) return trip;
      return {
        ...trip,
        days: trip.days.map((day) => ({
          ...day,
          activities: day.activities.map((act: Activity) => {
            if (act.id === activityId) {
              return {
                ...act,
                title: newTitle || pick.title,
                category: pick.category,
                description: pick.description,
                estimatedCost: pick.cost,
                weatherSuitability: pick.weather,
                status: 'replaced' as ActivityStatus,
              };
            }
            return act;
          }),
        })),
      };
    });
    set({ trips: updatedTrips });
  },

  addActivity: (partialActivity: Partial<Activity>) => {
    const { trips, activeTripId, activeDayNumber } = get();
    const currentTrip = trips.find((t: Trip) => t.id === activeTripId);
    const currentDay = currentTrip?.days.find((d) => d.dayNumber === activeDayNumber);
    const orderCount = (currentDay?.activities.length || 0) + 1;

    const newAct: Activity = {
      id: `act-new-${Date.now()}`,
      order: orderCount,
      time: partialActivity.time || '17:30',
      title: partialActivity.title || 'New Discovered Gem',
      category: partialActivity.category || 'sightseeing',
      priority: partialActivity.priority || 'medium',
      description: partialActivity.description || 'AI suggested stop tailored to your route.',
      estimatedCost: partialActivity.estimatedCost || 20,
      weatherSuitability: partialActivity.weatherSuitability || '☀️ Ideal condition',
      lat: partialActivity.lat || (currentDay?.activities[0]?.lat || 35.6764) + (Math.random() * 0.01 - 0.005),
      lng: partialActivity.lng || (currentDay?.activities[0]?.lng || 139.6993) + (Math.random() * 0.01 - 0.005),
      locationName: partialActivity.locationName || 'Central District',
      status: 'upcoming',
      durationMinutes: 60,
    };

    const updatedTrips: Trip[] = trips.map((trip: Trip) => {
      if (trip.id !== activeTripId) return trip;
      return {
        ...trip,
        days: trip.days.map((day) => {
          if (day.dayNumber !== activeDayNumber) return day;
          return {
            ...day,
            activities: [...day.activities, newAct],
          };
        }),
      };
    });

    set({ trips: updatedTrips, selectedActivityId: newAct.id, isPanelOpen: true });
  },

  executeAiCommand: (commandText: string) => {
    const text = commandText.toLowerCase();
    const { selectedActivityId, replaceActivity, addActivity, trips, activeTripId } = get();

    if (text.includes('replace') || text.includes('swap') || text.includes('change')) {
      if (selectedActivityId) {
        replaceActivity(selectedActivityId);
        return `Replaced activity with an AI-recommended spot.`;
      } else {
        const trip = trips.find((t: Trip) => t.id === activeTripId);
        const act = trip?.days[0]?.activities[0];
        if (act) {
          replaceActivity(act.id);
          return `Replaced "${act.title}" with a fresh cultural spot.`;
        }
      }
    }

    if (text.includes('budget') || text.includes('reduce') || text.includes('cheaper')) {
      const updatedTrips: Trip[] = trips.map((t: Trip) => {
        if (t.id !== activeTripId) return t;
        return {
          ...t,
          spentBudget: Math.max(100, t.spentBudget - 120),
          days: t.days.map((d) => ({
            ...d,
            activities: d.activities.map((a: Activity) => ({
              ...a,
              estimatedCost: Math.round(a.estimatedCost * 0.7),
            })),
          })),
        };
      });
      set({ trips: updatedTrips });
      return `Adjusted itinerary to budget-friendly options! Saved ~$120.`;
    }

    if (text.includes('walk') || text.includes('transit') || text.includes('taxi')) {
      return `Route re-optimized for minimal walking. Short transfers highlighted.`;
    }

    if (text.includes('museum') || text.includes('art') || text.includes('indoor') || text.includes('rain')) {
      addActivity({
        title: 'Mori Art Museum & Deck',
        category: 'sightseeing',
        description: 'Contemporary indoor museum with Tokyo view.',
        estimatedCost: 20,
        weatherSuitability: '☔ 100% Indoor & Rainproof',
      });
      return `Added Mori Art Museum to your day itinerary!`;
    }

    addActivity({
      title: 'Suggested AI Spot: Crepe Cafe',
      category: 'food',
      description: 'AI recommendation based on location density.',
      estimatedCost: 12,
    });
    return `AI updated your journey! Map route recalculated.`;
  },
}));
