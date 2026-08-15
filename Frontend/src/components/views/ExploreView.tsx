import React, { useState } from 'react';
import { useTravelStore } from '../../store/useTravelStore';

interface ExploreViewProps {
  onOpenCreateTrip: (destination: string) => void;
  onSelectDestination?: (destination: string) => void;
}

export const ExploreView: React.FC<ExploreViewProps> = ({
  onOpenCreateTrip,
  onSelectDestination,
}) => {
  const { setSelectedDestination } = useTravelStore();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [search, setSearch] = useState('');

  const categories = [
    { id: 'all', label: 'All Destinations' },
    { id: 'coastal', label: 'Coastal & Islands' },
    { id: 'culture', label: 'Cultural Capitals' },
    { id: 'alpine', label: 'Alpine & Nature' },
    { id: 'culinary', label: 'Culinary Havens' },
  ];

  const items = [
    {
      id: 'e1',
      title: 'Amalfi Coast',
      country: 'Italy',
      category: 'coastal',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80',
      description: 'Cliffside coastal villages, pastel architecture, private yacht tours, and lemon orchards.',
      tag: 'Mediterranean Luxury',
    },
    {
      id: 'e2',
      title: 'Kyoto',
      country: 'Japan',
      category: 'culture',
      rating: 4.95,
      image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
      description: 'Ancient wooden temples, serene Zen gardens, traditional tea houses, and seasonal cherry blossoms.',
      tag: 'Cultural Heritage',
    },
    {
      id: 'e3',
      title: 'Zurich & Swiss Alps',
      country: 'Switzerland',
      category: 'alpine',
      rating: 4.88,
      image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80',
      description: 'Crystal-clear alpine lakes, snow-capped mountain peaks, boutique shopping, and luxury spa resorts.',
      tag: 'Alpine Sanctuary',
    },
    {
      id: 'e4',
      title: 'Paris',
      country: 'France',
      category: 'culinary',
      rating: 4.92,
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
      description: 'Michelin three-star dining, haute couture, private Louvre museum tours, and Seine river cruises.',
      tag: 'Gastronomy & Art',
    },
    {
      id: 'e5',
      title: 'Santorini',
      country: 'Greece',
      category: 'coastal',
      rating: 4.91,
      image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80',
      description: 'Iconic whitewashed caldera cliffs, blue-domed churches, volcanic wineries, and golden hour sunsets.',
      tag: 'Island Paradise',
    },
    {
      id: 'e6',
      title: 'Tokyo',
      country: 'Japan',
      category: 'culture',
      rating: 4.94,
      image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80',
      description: 'Hyper-modern neon architecture, centuries-old shrines, omakase sushi bars, and high fashion.',
      tag: 'Metropolitan Art',
    },
    {
      id: 'e7',
      title: 'Bali',
      country: 'Indonesia',
      category: 'coastal',
      rating: 4.87,
      image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
      description: 'Lush terraced rice paddies, clifftop ocean temples, wellness sanctuaries, and private villa pools.',
      tag: 'Wellness & Nature',
    },
    {
      id: 'e8',
      title: 'Rome',
      country: 'Italy',
      category: 'culture',
      rating: 4.89,
      image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80',
      description: 'Ancient Colosseum ruins, Baroque fountains, private Vatican art tours, and authentic trattorias.',
      tag: 'Living History',
    },
  ];

  const filtered = items.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.country.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleExploreDestination = (title: string) => {
    setSelectedDestination(title);
    if (onSelectDestination) {
      onSelectDestination(title);
    }
  };

  return (
    <div className="flex flex-col w-full px-6 md:px-8 pb-16 space-y-8 mt-6 animate-fadeIn">
      {/* Title */}
      <div>
        <span className="font-label-caps text-[#1B3022] text-[10px]">Curated World Destinations</span>
        <h1 className="font-headline-lg text-3xl md:text-4xl text-[#2B241E]">Explore Experiences</h1>
        <p className="font-body-base text-sm text-[#685D52] mt-1">
          Handpicked luxury travel destinations tailored for your next unforgettable story.
        </p>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-2 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-body-semibold transition-all shrink-0 cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#1B3022] text-white shadow-xs'
                  : 'bg-[#F1EDE7] text-[#434843] hover:bg-[#8FA88E]/20'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#737973] text-[18px]">
            search
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter destination..."
            className="w-full bg-[#F1EDE7] border border-transparent rounded-full py-2 pl-9 pr-4 text-xs font-body-base text-[#242924] focus:outline-none focus:border-[#8FA88E]"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.map((item) => (
          <article
            key={item.id}
            className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_24px_rgba(43,36,30,0.05)] border border-[#E8E2D5]/60 group hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
          >
            <div
              className="h-52 w-full bg-cover bg-center relative cursor-pointer"
              onClick={() => handleExploreDestination(item.title)}
              style={{ backgroundImage: `url(${item.image})` }}
            >
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1 text-[11px] font-body-semibold text-[#2B241E]">
                <span className="material-symbols-outlined text-[14px] text-amber-500 fill-amber-500">star</span>
                {item.rating}
              </div>
              <div className="absolute bottom-3 left-3 bg-[#1B3022]/90 backdrop-blur-md px-3 py-1 rounded-full text-white text-[10px] font-label-caps">
                {item.tag}
              </div>
            </div>

            <div className="p-5 flex flex-col gap-3 flex-1 justify-between">
              <div
                className="cursor-pointer"
                onClick={() => handleExploreDestination(item.title)}
              >
                <span className="font-label-caps text-[9px] text-[#685D52]">{item.country}</span>
                <h3 className="font-title-lg text-lg text-[#2B241E] truncate group-hover:text-[#1B3022] transition-colors">{item.title}</h3>
                <p className="font-body-base text-xs text-[#685D52] mt-1.5 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-2">
                <button
                  onClick={() => handleExploreDestination(item.title)}
                  className="w-full bg-[#F1EDE7] text-[#1B3022] border border-[#8FA88E]/40 py-2.5 rounded-full font-body-semibold text-xs hover:bg-[#cfeacd] transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[14px]">explore</span>
                  Explore
                </button>
                <button
                  onClick={() => onOpenCreateTrip(item.title)}
                  className="w-full bg-[#1B3022] text-white py-2.5 rounded-full font-body-semibold text-xs shadow-md hover:bg-[#2c4634] transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[14px]">add</span>
                  Plan
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default ExploreView;
