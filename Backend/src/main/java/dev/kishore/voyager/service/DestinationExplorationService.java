package dev.kishore.voyager.service;

import dev.kishore.voyager.dto.response.DestinationDetailDto;
import dev.kishore.voyager.dto.response.DestinationSearchResultDto;
import dev.kishore.voyager.dto.response.DestinationSearchSuggestionDto;
import dev.kishore.voyager.service.places.GooglePlacesService;
import dev.kishore.voyager.service.places.RealPlaceDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class DestinationExplorationService {

    private final GooglePlacesService googlePlacesService;

    private static final List<DestinationSearchSuggestionDto> ALL_DESTINATIONS = List.of(
            DestinationSearchSuggestionDto.builder()
                    .id("dest-paris")
                    .title("Paris")
                    .subtitle("France • Europe")
                    .type("destination")
                    .destinationName("Paris")
                    .imageUrl("https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80")
                    .rating(4.9)
                    .build(),
            DestinationSearchSuggestionDto.builder()
                    .id("dest-kyoto")
                    .title("Kyoto")
                    .subtitle("Japan • Asia")
                    .type("destination")
                    .destinationName("Kyoto")
                    .imageUrl("https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80")
                    .rating(4.95)
                    .build(),
            DestinationSearchSuggestionDto.builder()
                    .id("dest-amalfi")
                    .title("Amalfi Coast")
                    .subtitle("Italy • Europe")
                    .type("destination")
                    .destinationName("Amalfi Coast")
                    .imageUrl("https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80")
                    .rating(4.88)
                    .build(),
            DestinationSearchSuggestionDto.builder()
                    .id("dest-zurich")
                    .title("Zurich & Swiss Alps")
                    .subtitle("Switzerland • Europe")
                    .type("destination")
                    .destinationName("Zurich")
                    .imageUrl("https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80")
                    .rating(4.92)
                    .build(),
            DestinationSearchSuggestionDto.builder()
                    .id("dest-[#tokyo]")
                    .title("Tokyo")
                    .subtitle("Japan • Asia")
                    .type("destination")
                    .destinationName("Tokyo")
                    .imageUrl("https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80")
                    .rating(4.94)
                    .build(),
            DestinationSearchSuggestionDto.builder()
                    .id("dest-rome")
                    .title("Rome")
                    .subtitle("Italy • Europe")
                    .type("destination")
                    .destinationName("Rome")
                    .imageUrl("https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80")
                    .rating(4.89)
                    .build(),
            DestinationSearchSuggestionDto.builder()
                    .id("dest-santorini")
                    .title("Santorini")
                    .subtitle("Greece • Europe")
                    .type("destination")
                    .destinationName("Santorini")
                    .imageUrl("https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80")
                    .rating(4.91)
                    .build(),
            DestinationSearchSuggestionDto.builder()
                    .id("dest-bali")
                    .title("Bali")
                    .subtitle("Indonesia • Asia")
                    .type("destination")
                    .destinationName("Bali")
                    .imageUrl("https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80")
                    .rating(4.87)
                    .build()
    );

    private static final List<DestinationSearchSuggestionDto> ALL_HOTELS = List.of(
            DestinationSearchSuggestionDto.builder()
                    .id("hotel-ritz-paris")
                    .title("Ritz Paris")
                    .subtitle("Luxury Palace • Paris")
                    .type("hotel")
                    .destinationName("Paris")
                    .imageUrl("https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80")
                    .rating(4.98)
                    .priceRange("$$$$$")
                    .build(),
            DestinationSearchSuggestionDto.builder()
                    .id("hotel-aman-kyoto")
                    .title("Aman Kyoto")
                    .subtitle("Secret Garden Sanctuary • Kyoto")
                    .type("hotel")
                    .destinationName("Kyoto")
                    .imageUrl("https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80")
                    .rating(4.96)
                    .priceRange("$$$$$")
                    .build(),
            DestinationSearchSuggestionDto.builder()
                    .id("hotel-belmond-amalfi")
                    .title("Belmond Hotel Caruso")
                    .subtitle("Cliffside Villa • Amalfi Coast")
                    .type("hotel")
                    .destinationName("Amalfi Coast")
                    .imageUrl("https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80")
                    .rating(4.94)
                    .priceRange("$$$$")
                    .build(),
            DestinationSearchSuggestionDto.builder()
                    .id("hotel-dolder-zurich")
                    .title("The Dolder Grand")
                    .subtitle("Alpine Spa Resort • Zurich")
                    .type("hotel")
                    .destinationName("Zurich")
                    .imageUrl("https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80")
                    .rating(4.93)
                    .priceRange("$$$$")
                    .build()
    );

    private static final List<DestinationSearchSuggestionDto> ALL_EXPERIENCES = List.of(
            DestinationSearchSuggestionDto.builder()
                    .id("exp-louvre")
                    .title("Louvre Private Sunset Tour")
                    .subtitle("Art & History • Paris")
                    .type("experience")
                    .destinationName("Paris")
                    .imageUrl("https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=800&q=80")
                    .rating(4.95)
                    .build(),
            DestinationSearchSuggestionDto.builder()
                    .id("exp-tea-kyoto")
                    .title("Traditional Matcha Tea Ceremony")
                    .subtitle("Cultural Heritage • Kyoto")
                    .type("experience")
                    .destinationName("Kyoto")
                    .imageUrl("https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80")
                    .rating(4.92)
                    .build(),
            DestinationSearchSuggestionDto.builder()
                    .id("exp-amalfi-boat")
                    .title("Private Yacht Cruise to Capri")
                    .subtitle("Sailing & Coastal • Amalfi Coast")
                    .type("experience")
                    .destinationName("Amalfi Coast")
                    .imageUrl("https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80")
                    .rating(4.97)
                    .build()
    );

    public DestinationSearchResultDto searchDestinations(String query) {
        String q = (query == null) ? "" : query.trim().toLowerCase();

        List<DestinationSearchSuggestionDto> matchedDestinations = ALL_DESTINATIONS.stream()
                .filter(d -> q.isEmpty() || d.getTitle().toLowerCase().contains(q) || d.getSubtitle().toLowerCase().contains(q))
                .collect(Collectors.toList());

        List<DestinationSearchSuggestionDto> matchedHotels = ALL_HOTELS.stream()
                .filter(h -> q.isEmpty() || h.getTitle().toLowerCase().contains(q) || h.getDestinationName().toLowerCase().contains(q))
                .collect(Collectors.toList());

        List<DestinationSearchSuggestionDto> matchedExperiences = ALL_EXPERIENCES.stream()
                .filter(e -> q.isEmpty() || e.getTitle().toLowerCase().contains(q) || e.getDestinationName().toLowerCase().contains(q))
                .collect(Collectors.toList());

        return DestinationSearchResultDto.builder()
                .query(query)
                .destinations(matchedDestinations)
                .hotels(matchedHotels)
                .experiences(matchedExperiences)
                .build();
    }

    public DestinationDetailDto getDestinationExploration(String destinationName) {
        String name = (destinationName == null || destinationName.isBlank()) ? "Paris" : destinationName.trim();

        // 1. Fetch real Places / POIs from Google Places API service
        List<RealPlaceDto> realPlaces = Collections.emptyList();
        try {
            realPlaces = googlePlacesService.getRealPlacesForDestination(name);
        } catch (Exception e) {
            log.warn("Google Places API fetch for destination exploration '{}' fallback: {}", name, e.getMessage());
        }

        // 2. Build metadata according to destination
        String country = "International Destination";
        String region = "World Explorer";
        String tagline = "A timeless retreat of culture, luxury, and organic beauty.";
        String description = "Discover curated world destinations tailored for extraordinary travel stories. Experience private tours, Michelin dining, and boutique retreats.";
        String heroImage = "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80";
        String bestTime = "May - October";
        String currency = "EUR (€)";
        BigDecimal avgDailyCost = BigDecimal.valueOf(280);

        if (name.equalsIgnoreCase("Paris")) {
            country = "France";
            region = "Île-de-France";
            tagline = "City of Light, High Fashion & Michelin Culinary Art";
            description = "Paris inspires timeless wonder with iconic grand boulevards, world-class museums, romantic Seine river cruises, and exquisite patisseries.";
            heroImage = "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80";
            bestTime = "April - October";
            currency = "EUR (€)";
            avgDailyCost = BigDecimal.valueOf(320);
        } else if (name.equalsIgnoreCase("Kyoto")) {
            country = "Japan";
            region = "Kansai";
            tagline = "Ancient Shrines, Cherry Blossom Groves & Zen Temples";
            description = "Kyoto is Japan's cultural heart, offering quiet bamboo groves, traditional tea houses, serene Zen gardens, and sublime kaiseki dining.";
            heroImage = "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80";
            bestTime = "March - May & Oct - Nov";
            currency = "JPY (¥)";
            avgDailyCost = BigDecimal.valueOf(250);
        } else if (name.equalsIgnoreCase("Amalfi Coast") || name.equalsIgnoreCase("Amalfi")) {
            country = "Italy";
            region = "Campania";
            tagline = "Dramatic Coastal Cliffs, Lemon Groves & Azure Waters";
            description = "The Amalfi Coast is a Mediterranean paradise of pastel cliffside villages, sun-drenched private yacht cruises, and romantic cliffside dining.";
            heroImage = "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80";
            bestTime = "May - September";
            currency = "EUR (€)";
            avgDailyCost = BigDecimal.valueOf(380);
        } else if (name.equalsIgnoreCase("Zurich")) {
            country = "Switzerland";
            region = "Alpine Canton";
            tagline = "Pristine Alpine Lakes, Modern Luxury & Chocolate Atelier";
            description = "Zurich blends lakeside tranquility with world-class luxury shopping along Bahnhofstrasse and easy access to snow-capped Swiss Alpine peaks.";
            heroImage = "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=1200&q=80";
            bestTime = "June - September & Dec - Feb";
            currency = "CHF (Fr)";
            avgDailyCost = BigDecimal.valueOf(410);
        }

        List<DestinationSearchSuggestionDto> relevantHotels = ALL_HOTELS.stream()
                .filter(h -> h.getDestinationName().equalsIgnoreCase(name))
                .collect(Collectors.toList());

        List<DestinationSearchSuggestionDto> relevantExperiences = ALL_EXPERIENCES.stream()
                .filter(e -> e.getDestinationName().equalsIgnoreCase(name))
                .collect(Collectors.toList());

        return DestinationDetailDto.builder()
                .name(name)
                .country(country)
                .region(region)
                .tagline(tagline)
                .description(description)
                .heroImage(heroImage)
                .bestTimeToVisit(bestTime)
                .currency(currency)
                .avgDailyCost(avgDailyCost)
                .rating(4.9)
                .popularStyles(List.of("Luxury & Culinary", "Cultural Explorer", "Relaxed & Nature"))
                .places(realPlaces)
                .hotels(relevantHotels)
                .experiences(relevantExperiences)
                .build();
    }
}
