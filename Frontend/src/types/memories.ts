export interface MemoryPhoto {
  id: string;
  url: string;
  title: string;
  locationName?: string;
  date?: string;
}

export interface GroupedMemorySection {
  locationName: string;
  photos: MemoryPhoto[];
}

export interface MemoryAlbum {
  id: string;
  destination: string;
  country: string;
  coverImage: string;
  photoCount: number;
  startDate?: string;
  endDate?: string;
  tripId?: number;
  groupedSections?: GroupedMemorySection[];
}
