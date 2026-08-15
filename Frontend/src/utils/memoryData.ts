import type { TripResponse } from '../types/dto';
import type { TripPhotoDto } from '../api/photos';
import type { MemoryAlbum, GroupedMemorySection, MemoryPhoto } from '../types/memories';

// Map an authentic user trip and its user-uploaded photos to a MemoryAlbum structure
export function mapTripToMemoryAlbum(trip: TripResponse, photos: TripPhotoDto[] = []): MemoryAlbum {
  const destName = trip.destination || 'Destination';
  const destLower = destName.toLowerCase();

  let country = 'Travel Journey';
  if (destLower.includes('italy') || destLower.includes('amalfi') || destLower.includes('rome') || destLower.includes('positano')) {
    country = 'Italy';
  } else if (destLower.includes('japan') || destLower.includes('kyoto') || destLower.includes('tokyo')) {
    country = 'Japan';
  } else if (destLower.includes('greece') || destLower.includes('santorini')) {
    country = 'Greece';
  } else if (destLower.includes('india') || destLower.includes('delhi') || destLower.includes('mumbai') || destLower.includes('goa') || destLower.includes('jaipur')) {
    country = 'India';
  } else if (destLower.includes('france') || destLower.includes('paris')) {
    country = 'France';
  }

  // Convert raw TripPhotoDto array into MemoryPhoto items
  const memoryPhotos: MemoryPhoto[] = photos.map((p) => ({
    id: String(p.id),
    url: p.url,
    title: p.title || `${destName} Memory`,
    locationName: p.locationName || destName,
    date: p.uploadedAt ? new Date(p.uploadedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : undefined,
  }));

  // Group photos by locationName
  const locationMap = new Map<string, MemoryPhoto[]>();
  memoryPhotos.forEach((photo) => {
    const loc = photo.locationName || destName;
    if (!locationMap.has(loc)) {
      locationMap.set(loc, []);
    }
    locationMap.get(loc)!.push(photo);
  });

  const groupedSections: GroupedMemorySection[] = Array.from(locationMap.entries()).map(
    ([locationName, locPhotos]) => ({
      locationName,
      photos: locPhotos,
    })
  );

  // Cover image is the first uploaded photo, or trip's destination image if no user photos yet
  const coverImage = memoryPhotos.length > 0
    ? memoryPhotos[0].url
    : (trip.imageUrl || 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1000&q=80');

  return {
    id: String(trip.id),
    destination: destName,
    country,
    coverImage,
    photoCount: memoryPhotos.length,
    startDate: trip.startDate || '2026',
    endDate: trip.endDate || '2026',
    tripId: trip.id,
    groupedSections,
  };
}

// Generate the complete list of MemoryAlbums based ONLY on the user's actual trips
export function getUserMemoryAlbums(myTrips: TripResponse[], photosMap: Record<number, TripPhotoDto[]> = {}): MemoryAlbum[] {
  if (!myTrips || myTrips.length === 0) {
    return [];
  }

  return myTrips.map((trip) => {
    const tripPhotos = photosMap[trip.id] || [];
    return mapTripToMemoryAlbum(trip, tripPhotos);
  });
}
