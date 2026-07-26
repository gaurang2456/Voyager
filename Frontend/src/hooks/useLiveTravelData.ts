import { useEffect } from 'react';
import { useTravelStore } from '../store/useTravelStore';
import { useAuthStore } from '../store/useAuthStore';
import { useMyTripsQuery } from './useTrips';

export function useLiveTravelData() {
  const { currentView, token } = useAuthStore();
  const { activeTripId, setActiveTrip } = useTravelStore();

  const isAuth = currentView === 'map' && Boolean(token);

  // 1. Fetch user trips from Spring Boot backend
  const { data: myTripsData } = useMyTripsQuery(isAuth);

  // 2. Select initial active trip if available (WITHOUT auto-creating backend trips)
  useEffect(() => {
    if (myTripsData && myTripsData.length > 0) {
      const exists = myTripsData.some((t) => String(t.id) === String(activeTripId));
      if (!activeTripId || !exists) {
        setActiveTrip(String(myTripsData[0].id));
      }
    } else if (myTripsData && myTripsData.length === 0) {
      setActiveTrip(null);
    }
  }, [myTripsData, activeTripId, setActiveTrip]);
}
