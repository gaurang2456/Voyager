import { create } from 'zustand';
import type { ActivityCategory } from '../types/travel';

export interface TravelUIState {
  activeTripId: string | null;
  activeDayNumber: number;
  selectedActivityId: string | null;
  hoveredActivityId: string | null;
  isPanelOpen: boolean;
  filterCategory: ActivityCategory | 'all';
  searchQuery: string;

  setActiveTrip: (tripId: string | null) => void;
  setActiveDay: (dayNumber: number) => void;
  setSelectedActivity: (activityId: string | null) => void;
  setHoveredActivity: (activityId: string | null) => void;
  setPanelOpen: (isOpen: boolean) => void;
  setFilterCategory: (category: ActivityCategory | 'all') => void;
  setSearchQuery: (query: string) => void;
}

export const useTravelStore = create<TravelUIState>((set) => ({
  activeTripId: null,
  activeDayNumber: 1,
  selectedActivityId: null,
  hoveredActivityId: null,
  isPanelOpen: false,
  filterCategory: 'all',
  searchQuery: '',

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
}));
