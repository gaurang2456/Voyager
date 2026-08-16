import { create } from 'zustand';
import type { ActivityCategory } from '../types/travel';
import type { TripResponse } from '../types/dto';

export interface SavedItem {
  id: string;
  title: string;
  location: string;
  imageUrl?: string;
  category?: string;
  travelStyle?: string;
  note?: string;
}

export interface TravelUIState {
  activeTripId: string | null;
  activeDayNumber: number;
  selectedActivityId: string | null;
  hoveredActivityId: string | null;
  isPanelOpen: boolean;
  filterCategory: ActivityCategory | 'all';
  searchQuery: string;
  completedActivityIds: Record<string, boolean>;
  skippedActivityIds: Record<string, boolean>;
  selectedDestinationName: string | null;
  savedItems: SavedItem[];

  setActiveTrip: (tripId: string | null) => void;
  setActiveDay: (dayNumber: number) => void;
  setSelectedActivity: (activityId: string | null) => void;
  setHoveredActivity: (activityId: string | null) => void;
  setPanelOpen: (isOpen: boolean) => void;
  setFilterCategory: (category: ActivityCategory | 'all') => void;
  setSearchQuery: (query: string) => void;
  toggleActivityCompleted: (activityId: string) => void;
  toggleActivitySkipped: (activityId: string) => void;
  setSelectedDestination: (name: string | null) => void;
  toggleSaveTrip: (trip: TripResponse) => void;
  isTripSaved: (tripId: number | string) => boolean;
  removeSavedItem: (id: string) => void;
}

export const useTravelStore = create<TravelUIState>((set, get) => ({
  activeTripId: null,
  activeDayNumber: 1,
  selectedActivityId: null,
  hoveredActivityId: null,
  isPanelOpen: false,
  filterCategory: 'all',
  searchQuery: '',
  completedActivityIds: {},
  skippedActivityIds: {},
  selectedDestinationName: null,
  savedItems: [],

  setActiveTrip: (tripId: string | null) =>
    set({ activeTripId: tripId, activeDayNumber: 1, selectedActivityId: null, isPanelOpen: false }),
  setActiveDay: (dayNumber: number) =>
    set({ activeDayNumber: dayNumber, selectedActivityId: null, isPanelOpen: false }),
  setSelectedActivity: (activityId: string | null) => {
    if (!activityId) {
      set({ selectedActivityId: null, isPanelOpen: false });
    } else {
      set({ selectedActivityId: activityId, isPanelOpen: true });
    }
  },
  setHoveredActivity: (activityId: string | null) => set({ hoveredActivityId: activityId }),
  setPanelOpen: (isOpen: boolean) => set({ isPanelOpen: isOpen }),
  setFilterCategory: (category: ActivityCategory | 'all') => set({ filterCategory: category }),
  setSearchQuery: (query: string) => set({ searchQuery: query }),
  toggleActivityCompleted: (activityId: string) =>
    set((state) => ({
      completedActivityIds: {
        ...state.completedActivityIds,
        [activityId]: !state.completedActivityIds[activityId],
      },
    })),
  toggleActivitySkipped: (activityId: string) =>
    set((state) => ({
      skippedActivityIds: {
        ...state.skippedActivityIds,
        [activityId]: !state.skippedActivityIds[activityId],
      },
    })),
  setSelectedDestination: (name: string | null) => set({ selectedDestinationName: name }),
  toggleSaveTrip: (trip: TripResponse) =>
    set((state) => {
      const exists = state.savedItems.some((item) => item.id === String(trip.id));
      if (exists) {
        return {
          savedItems: state.savedItems.filter((item) => item.id !== String(trip.id)),
        };
      }
      const newItem: SavedItem = {
        id: String(trip.id),
        title: trip.destination,
        location: trip.destination,
        imageUrl: trip.imageUrl,
        travelStyle: trip.travelStyle,
      };
      return { savedItems: [...state.savedItems, newItem] };
    }),
  isTripSaved: (tripId: number | string) => {
    return get().savedItems.some((item) => item.id === String(tripId));
  },
  removeSavedItem: (id: string) =>
    set((state) => ({
      savedItems: state.savedItems.filter((item) => item.id !== id),
    })),
}));
