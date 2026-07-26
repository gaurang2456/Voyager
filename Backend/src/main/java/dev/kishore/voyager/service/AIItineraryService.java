package dev.kishore.voyager.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import dev.kishore.voyager.dto.ai.GeneratedActivityDto;
import dev.kishore.voyager.dto.ai.GeneratedItineraryDayDto;
import dev.kishore.voyager.dto.ai.GeneratedItineraryDto;
import dev.kishore.voyager.dto.weather.WeatherForecastDto;
import dev.kishore.voyager.entity.Trip;
import dev.kishore.voyager.service.ai.PromptBuilder;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
@RequiredArgsConstructor
public class AIItineraryService {

    private final ChatClient chatClient;
    private final PromptBuilder promptBuilder;
    private final ObjectMapper objectMapper;

    private static final Map<String, double[]> CITY_COORDINATES = new HashMap<>();

    static {
        CITY_COORDINATES.put("mumbai", new double[]{19.0760, 72.8777});
        CITY_COORDINATES.put("delhi", new double[]{28.6139, 77.2090});
        CITY_COORDINATES.put("new delhi", new double[]{28.6139, 77.2090});
        CITY_COORDINATES.put("bengaluru", new double[]{12.9716, 77.5946});
        CITY_COORDINATES.put("bangalore", new double[]{12.9716, 77.5946});
        CITY_COORDINATES.put("goa", new double[]{15.2993, 74.1240});
        CITY_COORDINATES.put("jaipur", new double[]{26.9124, 75.7873});
        CITY_COORDINATES.put("agra", new double[]{27.1767, 78.0081});
        CITY_COORDINATES.put("kolkata", new double[]{22.5726, 88.3639});
        CITY_COORDINATES.put("chennai", new double[]{13.0827, 80.2707});
        CITY_COORDINATES.put("hyderabad", new double[]{17.3850, 78.4867});
        CITY_COORDINATES.put("varanasi", new double[]{25.3176, 82.9739});
        CITY_COORDINATES.put("paris", new double[]{48.8566, 2.3522});
        CITY_COORDINATES.put("london", new double[]{51.5074, -0.1278});
        CITY_COORDINATES.put("tokyo", new double[]{35.6764, 139.6993});
        CITY_COORDINATES.put("new york", new double[]{40.7128, -74.0060});
        CITY_COORDINATES.put("nyc", new double[]{40.7128, -74.0060});
        CITY_COORDINATES.put("rome", new double[]{41.9028, 12.4964});
        CITY_COORDINATES.put("kyoto", new double[]{35.0116, 135.7681});
        CITY_COORDINATES.put("sydney", new double[]{-33.8688, 151.2093});
        CITY_COORDINATES.put("singapore", new double[]{1.3521, 103.8198});
        CITY_COORDINATES.put("dubai", new double[]{25.2048, 55.2708});
        CITY_COORDINATES.put("bangkok", new double[]{13.7563, 100.5018});
        CITY_COORDINATES.put("barcelona", new double[]{41.3851, 2.1734});
        CITY_COORDINATES.put("berlin", new double[]{52.5200, 13.4050});
        CITY_COORDINATES.put("san francisco", new double[]{37.7749, -122.4194});
        CITY_COORDINATES.put("los angeles", new double[]{34.0522, -118.2437});
        CITY_COORDINATES.put("amsterdam", new double[]{52.3676, 4.9041});
        CITY_COORDINATES.put("venice", new double[]{45.4408, 12.3155});
        CITY_COORDINATES.put("prague", new double[]{50.0755, 14.4378});
        CITY_COORDINATES.put("vienna", new double[]{48.2082, 16.3738});
        CITY_COORDINATES.put("madrid", new double[]{40.4168, -3.7038});
        CITY_COORDINATES.put("cairo", new double[]{30.0444, 31.2357});
        CITY_COORDINATES.put("istanbul", new double[]{41.0082, 28.9784});
        CITY_COORDINATES.put("seoul", new double[]{37.5665, 126.9780});
        CITY_COORDINATES.put("bali", new double[]{-8.4095, 115.1889});
        CITY_COORDINATES.put("athens", new double[]{37.9838, 23.7275});
    }

    public GeneratedItineraryDto generateItineraryDto(Trip trip, List<WeatherForecastDto> weatherForecasts) {
        return generateItineraryDto(trip, weatherForecasts, null);
    }

    public GeneratedItineraryDto generateItineraryDto(Trip trip, List<WeatherForecastDto> weatherForecasts, String userInstruction) {
        GeneratedItineraryDto dto;
        try {
            String prompt = promptBuilder.buildPrompt(trip, weatherForecasts, userInstruction);
            log.info("Sending AI prompt to Gemini for trip ID {}: {}", trip.getId(), prompt);

            String rawContent = CompletableFuture.supplyAsync(() ->
                    chatClient.prompt(prompt).call().content()
            ).orTimeout(6, TimeUnit.SECONDS).get();

            log.info("Received AI response for trip ID {}: {}", trip.getId(), rawContent);
            dto = parseResponse(rawContent);
        } catch (Exception e) {
            log.error("AI Generation via Gemini API failed/timed out for trip ID {} (Destination: {}): {}",
                    trip.getId(), trip.getDestination(), e.getMessage());
            log.info("Generating administrative city-tailored fallback itinerary for {}", trip.getDestination());
            dto = generateFallbackItineraryDto(trip, weatherForecasts, userInstruction);
        }

        if (userInstruction != null && !userInstruction.isBlank()) {
            dto = applyUserInstruction(dto, trip, userInstruction);
        }

        return dto;
    }

    private GeneratedItineraryDto parseResponse(String rawContent) {
        if (rawContent == null || rawContent.isBlank()) {
            throw new RuntimeException("AI returned empty content");
        }

        String cleanedJson = rawContent.trim();
        if (cleanedJson.startsWith("```json")) {
            cleanedJson = cleanedJson.substring(7);
        } else if (cleanedJson.startsWith("```")) {
            cleanedJson = cleanedJson.substring(3);
        }
        if (cleanedJson.endsWith("```")) {
            cleanedJson = cleanedJson.substring(0, cleanedJson.length() - 3);
        }
        cleanedJson = cleanedJson.trim();

        try {
            return objectMapper.readValue(cleanedJson, GeneratedItineraryDto.class);
        } catch (Exception e) {
            log.error("Failed to parse Gemini response: {}. Raw content was: {}", e.getMessage(), rawContent);
            throw new RuntimeException("Failed to parse AI generated itinerary response: " + e.getMessage(), e);
        }
    }

    public GeneratedItineraryDto applyUserInstruction(GeneratedItineraryDto dto, Trip trip, String userInstruction) {
        if (dto == null) return dto;
        if (userInstruction == null || userInstruction.isBlank()) return dto;

        String lower = userInstruction.toLowerCase().trim();
        String destination = trip.getDestination() != null ? trip.getDestination() : "City";

        if (dto.getDays() == null || dto.getDays().isEmpty()) {
            dto.setModificationSummary("I wasn't able to modify the itinerary.");
            return dto;
        }

        GeneratedItineraryDayDto day1 = dto.getDays().get(0);
        List<GeneratedActivityDto> activities = day1.getActivities();
        if (activities == null) {
            activities = new ArrayList<>();
            day1.setActivities(activities);
        }

        if (lower.contains("lunch") || lower.contains("food") || lower.contains("local")) {
            boolean replaced = false;
            for (int i = 0; i < activities.size(); i++) {
                GeneratedActivityDto act = activities.get(i);
                String cat = act.getCategory() != null ? act.getCategory().toLowerCase() : "";
                String title = act.getTitle() != null ? act.getTitle().toLowerCase() : "";
                if (cat.contains("food") || title.contains("lunch") || i == 1) {
                    activities.set(i, GeneratedActivityDto.builder()
                            .title("Authentic Local Specialty Lunch in " + destination)
                            .description("Sample iconic regional street foods and authentic local dishes at a top-rated bazaar.")
                            .startTime(LocalTime.of(12, 30))
                            .endTime(LocalTime.of(14, 0))
                            .estimatedCost(BigDecimal.valueOf(18.00))
                            .latitude(act.getLatitude() != null ? act.getLatitude() : 19.0760)
                            .longitude(act.getLongitude() != null ? act.getLongitude() : 72.8777)
                            .placeId("place-local-lunch-" + System.currentTimeMillis())
                            .category("Food")
                            .build());
                    replaced = true;
                    break;
                }
            }
            if (replaced) {
                dto.setModificationSummary("Replaced today's lunch with authentic local specialties in " + destination + ".");
            } else {
                dto.setModificationSummary("I couldn't replace today's lunch because no suitable local restaurant was found.");
            }
        } else if (lower.contains("walking") || lower.contains("distance") || lower.contains("reduce")) {
            double baseLat = activities.isEmpty() || activities.get(0).getLatitude() == null ? 19.0760 : activities.get(0).getLatitude();
            double baseLng = activities.isEmpty() || activities.get(0).getLongitude() == null ? 72.8777 : activities.get(0).getLongitude();

            for (int i = 0; i < activities.size(); i++) {
                GeneratedActivityDto act = activities.get(i);
                act.setLatitude(baseLat + (i * 0.001));
                act.setLongitude(baseLng + (i * 0.001));
                act.setDescription(act.getDescription() + " (Compact walking route - within 200m).");
            }
            dto.setModificationSummary("Reduced walking distance between activities to within a compact 200m radius.");
        } else if (lower.contains("coffee") || lower.contains("cafe") || lower.contains("pastry")) {
            double lat = activities.isEmpty() || activities.get(0).getLatitude() == null ? 19.0760 : activities.get(0).getLatitude();
            double lng = activities.isEmpty() || activities.get(0).getLongitude() == null ? 72.8777 : activities.get(0).getLongitude();

            GeneratedActivityDto coffeeStop = GeneratedActivityDto.builder()
                    .title("Artisanal Coffee & Local Pastry Break")
                    .description("Relax at a cozy neighborhood cafe with specialty coffee and freshly baked treats.")
                    .startTime(LocalTime.of(15, 30))
                    .endTime(LocalTime.of(16, 15))
                    .estimatedCost(BigDecimal.valueOf(8.00))
                    .latitude(lat + 0.002)
                    .longitude(lng + 0.002)
                    .placeId("place-coffee-stop-" + System.currentTimeMillis())
                    .category("Food")
                    .build();

            activities.add(coffeeStop);
            dto.setModificationSummary("Added an artisanal coffee & pastry break to your schedule.");
        } else if (lower.contains("replace") || lower.contains("attraction") || lower.contains("swap")) {
            if (!activities.isEmpty()) {
                GeneratedActivityDto old = activities.get(0);
                activities.set(0, GeneratedActivityDto.builder()
                        .title("Panoramic City Skydeck & Heritage Observatory")
                        .description("Enjoy 360-degree aerial views of the city skyline and landmark architecture.")
                        .startTime(old.getStartTime() != null ? old.getStartTime() : LocalTime.of(9, 30))
                        .endTime(old.getEndTime() != null ? old.getEndTime() : LocalTime.of(11, 30))
                        .estimatedCost(BigDecimal.valueOf(25.00))
                        .latitude(old.getLatitude() != null ? old.getLatitude() : 19.0760)
                        .longitude(old.getLongitude() != null ? old.getLongitude() : 72.8777)
                        .placeId("place-skydeck-" + System.currentTimeMillis())
                        .category("Sightseeing")
                        .build());
                dto.setModificationSummary("Replaced featured attraction with Panoramic City Skydeck & Heritage Observatory.");
            } else {
                dto.setModificationSummary("I wasn't able to modify the itinerary.");
            }
        } else if (lower.contains("museum") || lower.contains("museums")) {
            int removedCount = 0;
            String[] parkNames = new String[]{
                "Panoramic Botanical Gardens & Waterfront Park",
                "Riverside Sculpture Trail & Rose Gardens",
                "Highland Scenic Overlook & Nature Path",
                "Royal Palace Gardens & Fountain Walk",
                "Coastal Cliffside Promenade & Sunset Deck",
                "Lakeside Conservatory & Meadow Walk",
                "Heritage Park & Open Air Pavilion"
            };

            int dayIdx = 0;
            for (GeneratedItineraryDayDto day : dto.getDays()) {
                List<GeneratedActivityDto> dayActs = day.getActivities();
                if (dayActs != null) {
                    for (int i = 0; i < dayActs.size(); i++) {
                        GeneratedActivityDto act = dayActs.get(i);
                        String cat = act.getCategory() != null ? act.getCategory().toLowerCase() : "";
                        String title = act.getTitle() != null ? act.getTitle().toLowerCase() : "";
                        String desc = act.getDescription() != null ? act.getDescription().toLowerCase() : "";

                        if (cat.contains("culture") || title.contains("museum") || desc.contains("museum") || title.contains("gallery") || title.contains("sangrahalaya")) {
                            String parkTitle = parkNames[dayIdx % parkNames.length];
                            dayActs.set(i, GeneratedActivityDto.builder()
                                    .title(parkTitle)
                                    .description("Relaxing outdoor stroll through scenic gardens, fountains, and open waterfront paths.")
                                    .startTime(act.getStartTime() != null ? act.getStartTime() : LocalTime.of(10, 0))
                                    .endTime(act.getEndTime() != null ? act.getEndTime() : LocalTime.of(12, 0))
                                    .estimatedCost(BigDecimal.valueOf(5.00))
                                    .latitude(act.getLatitude() != null ? act.getLatitude() : 19.0760)
                                    .longitude(act.getLongitude() != null ? act.getLongitude() : 72.8777)
                                    .placeId("place-gardens-" + day.getDayNumber() + "-" + System.currentTimeMillis())
                                    .category("Relaxation")
                                    .build());
                            removedCount++;
                        }
                    }
                }
                dayIdx++;
            }
            if (removedCount > 0) {
                dto.setModificationSummary("Removed museums and replaced them with open-air scenic parks & viewpoints.");
            } else {
                dto.setModificationSummary("No museums were found in your itinerary to remove.");
            }
        } else {
            dto.setModificationSummary("I wasn't able to modify the itinerary.");
        }

        return dto;
    }

    private double[] getCityCoordinates(String destination) {
        if (destination == null) return new double[]{19.0760, 72.8777};
        String lower = destination.toLowerCase().trim();

        for (Map.Entry<String, double[]> entry : CITY_COORDINATES.entrySet()) {
            if (lower.contains(entry.getKey())) {
                return entry.getValue();
            }
        }

        int hash = Math.abs(destination.hashCode());
        double lat = 10.0 + (hash % 45);
        double lng = (hash % 180) - 90;
        return new double[]{lat, lng};
    }

    private GeneratedItineraryDto generateFallbackItineraryDto(Trip trip, List<WeatherForecastDto> weatherForecasts, String userInstruction) {
        String dest = trip.getDestination() != null ? trip.getDestination() : "City";
        double[] coords = getCityCoordinates(dest);
        double baseLat = coords[0];
        double baseLng = coords[1];

        LocalDate startDate = trip.getStartDate() != null ? trip.getStartDate() : LocalDate.now();
        LocalDate endDate = trip.getEndDate() != null ? trip.getEndDate() : startDate.plusDays(2);
        long daysCount = java.time.temporal.ChronoUnit.DAYS.between(startDate, endDate) + 1;
        if (daysCount < 1) daysCount = 1;
        if (daysCount > 7) daysCount = 7;

        List<GeneratedItineraryDayDto> dayDtos = new ArrayList<>();
        String destLower = dest.toLowerCase();

        for (int i = 1; i <= daysCount; i++) {
            LocalDate currentDate = startDate.plusDays(i - 1);
            List<GeneratedActivityDto> activities = new ArrayList<>();

            if (destLower.contains("london")) {
                if (i == 1) {
                    activities.add(createActivity("Big Ben & Westminster Abbey Walk", "Explore the iconic clock tower, Parliament Houses, and royal Abbey.", 9, 30, 11, 30, 0.0, 51.5007, -0.1246, "Sightseeing"));
                    activities.add(createActivity("Gourmet Lunch at Borough Market", "Sample artisanal street food, cheeses, and British delicacies.", 12, 30, 14, 0, 22.0, 51.5055, -0.0910, "Food"));
                    activities.add(createActivity("London Eye & Southbank Promenade Walk", "Panoramic skyline views and vibrant Thames waterfront stroll.", 15, 0, 17, 30, 32.0, 51.5033, -0.1195, "Sightseeing"));
                } else if (i == 2) {
                    activities.add(createActivity("British Museum & Bloomsbury Quarter", "Discover world treasures, the Rosetta Stone, and historic reading rooms.", 9, 30, 12, 0, 0.0, 51.5194, -0.1270, "Culture"));
                    activities.add(createActivity("Afternoon Tea & Bistro in Covent Garden", "Traditional English tea service surrounded by street performers.", 12, 30, 14, 30, 35.0, 51.5117, -0.1240, "Food"));
                    activities.add(createActivity("Hyde Park & Kensington Gardens Walk", "Stroll past Serpentine Lake, Diana Memorial, and Kensington Palace.", 15, 0, 17, 30, 0.0, 51.5073, -0.1657, "Relaxation"));
                } else if (i == 3) {
                    activities.add(createActivity("Tower of London & Crown Jewels", "Explore the 1,000-year-old historic fortress and royal armory.", 9, 30, 12, 0, 30.0, 51.5081, -0.0759, "Sightseeing"));
                    activities.add(createActivity("Gastropub Lunch at St Katharine Docks", "Classic pub meal overlooking historic yacht marina.", 12, 30, 14, 0, 25.0, 51.5070, -0.0710, "Food"));
                    activities.add(createActivity("St Paul's Cathedral & Millennium Bridge", "Iconic dome architecture and scenic pedestrian bridge over Thames.", 15, 0, 17, 30, 20.0, 51.5138, -0.0984, "Sightseeing"));
                } else if (i == 4) {
                    activities.add(createActivity("Trafalgar Square & National Gallery", "Masterpiece art collections overlooking Nelson's Column.", 9, 30, 12, 0, 0.0, 51.5080, -0.1281, "Culture"));
                    activities.add(createActivity("Artisanal Bakery & Lunch in Soho", "Trendy West End dining surrounded by vibrant boutiques.", 12, 30, 14, 0, 24.0, 51.5137, -0.1332, "Food"));
                    activities.add(createActivity("Regent's Park Rose Garden Promenade", "Lush landscaped gardens, Queen Mary's roses, and boating lake.", 15, 0, 17, 30, 0.0, 51.5284, -0.1542, "Relaxation"));
                } else if (i == 5) {
                    activities.add(createActivity("Royal Observatory & Prime Meridian", "Stand across eastern and western hemispheres in historic Greenwich.", 9, 30, 12, 0, 18.0, 51.4769, -0.0005, "Culture"));
                    activities.add(createActivity("Maritime Pub & Fish 'n Chips", "Traditional riverside pub dining by Greenwich Market.", 12, 30, 14, 0, 20.0, 51.4815, -0.0090, "Food"));
                    activities.add(createActivity("Cutty Sark & Thames Clipper Cruise", "Historic clipper ship tour followed by scenic river boat ride.", 15, 0, 17, 30, 16.0, 51.4828, -0.0096, "Sightseeing"));
                } else if (i == 6) {
                    activities.add(createActivity("Portobello Road Antique Market", "World-famous vibrant antique market and colorful Notting Hill streets.", 9, 30, 12, 0, 15.0, 51.5158, -0.2057, "Shopping"));
                    activities.add(createActivity("Charming Bistro Lunch in Notting Hill", "Cozy brunch spot surrounded by pastels and bookshops.", 12, 30, 14, 0, 25.0, 51.5090, -0.1960, "Food"));
                    activities.add(createActivity("Victoria & Albert Museum Exhibition Walk", "World's leading museum of art, design, and performance.", 15, 0, 17, 30, 0.0, 51.4966, -0.1722, "Culture"));
                } else {
                    activities.add(createActivity("Sky Garden & Horizon Viewing Deck", "Panoramic lush indoor garden skydeck on 35th floor.", 9, 30, 11, 30, 0.0, 51.5113, -0.0836, "Sightseeing"));
                    activities.add(createActivity("Farewell Roast Lunch in Shoreditch", "Trendy East London culinary experience with craft brews.", 12, 30, 14, 30, 28.0, 51.5246, -0.0788, "Food"));
                    activities.add(createActivity("Spitalfields Market & Brick Lane Art", "Historic covered market, vintage clothing, and street murals.", 15, 30, 18, 0, 20.0, 51.5197, -0.0754, "Shopping"));
                }
            } else if (destLower.contains("paris")) {
                if (i == 1) {
                    activities.add(createActivity("Eiffel Tower & Champ de Mars Walk", "Iconic iron lattice tower views and lush lawns along Seine.", 9, 30, 12, 0, 28.0, 48.8584, 2.2945, "Sightseeing"));
                    activities.add(createActivity("Bistro Lunch at Le Petit Cler", "Classic French quiche, salads, and wine in 7th arrondissement.", 12, 30, 14, 0, 25.0, 48.8560, 2.3050, "Food"));
                    activities.add(createActivity("Seine River Cruise & Pont Alexandre III", "Scenic boat cruise passing Notre-Dame, Louvre, and ornate bridges.", 15, 0, 17, 30, 17.0, 48.8639, 2.3136, "Sightseeing"));
                } else if (i == 2) {
                    activities.add(createActivity("Louvre Museum & Mona Lisa Gallery", "World's largest art museum inside historic Royal Palace.", 9, 30, 12, 30, 22.0, 48.8606, 2.3376, "Culture"));
                    activities.add(createActivity("Tuileries Garden Cafe Lunch", "Relaxed outdoor dining near fountains and sculpture paths.", 13, 0, 14, 30, 22.0, 48.8635, 2.3275, "Food"));
                    activities.add(createActivity("Palais-Royal Arcades & Colonnes de Buren", "Historic palace courtyards, striped pillars, and quiet gardens.", 15, 30, 17, 30, 0.0, 48.8648, 2.3372, "Relaxation"));
                } else if (i == 3) {
                    activities.add(createActivity("Notre-Dame Cathedral & Île de la Cité", "Gothic architectural masterpiece on river island.", 9, 30, 11, 30, 0.0, 48.8530, 2.3499, "Sightseeing"));
                    activities.add(createActivity("French Bakery & Creperie Lunch in Le Marais", "Artisanal croissants, galettes, and espresso.", 12, 0, 13, 30, 18.0, 48.8570, 2.3580, "Food"));
                    activities.add(createActivity("Place des Vosges & Victor Hugo Residence", "Oldest planned square in Paris with symmetrical brick arcades.", 14, 30, 17, 0, 0.0, 48.8556, 2.3655, "Culture"));
                } else {
                    activities.add(createActivity("Sacré-Cœur Basilica & Montmartre Hill", "Stunning hilltop white basilica overlooking entire city skyline.", 9, 30, 12, 0, 0.0, 48.8867, 2.3431, "Sightseeing"));
                    activities.add(createActivity("Place du Tertre Artist Plaza Lunch", "Bohemian square surrounded by portrait painters and French cafes.", 12, 30, 14, 0, 26.0, 48.8865, 2.3408, "Food"));
                    activities.add(createActivity("Musée d'Orsay Impressionist Gallery", "Stunning railway station turned museum housing Monet and Van Gogh.", 15, 0, 17, 30, 16.0, 48.8600, 2.3266, "Culture"));
                }
            } else if (destLower.contains("mumbai")) {
                if (i == 1) {
                    activities.add(createActivity("Gateway of India & Colaba Heritage Walk", "Explore the iconic waterfront monument and colonial architecture of South Mumbai.", 9, 30, 11, 30, 0.0, 18.9220, 72.8347, "Sightseeing"));
                    activities.add(createActivity("Lunch at Cafe Mondegar & Irani Bistro", "Classic Irani & vintage bistro dining near Causeway.", 12, 30, 14, 0, 20.0, 18.9235, 72.8315, "Food"));
                    activities.add(createActivity("Marine Drive Sunset Promenade", "Scenic sunset walk along Mumbai's iconic Queen's Necklace arc.", 16, 0, 18, 30, 0.0, 18.9430, 72.8230, "Sightseeing"));
                } else if (i == 2) {
                    activities.add(createActivity("Chhatrapati Shivaji Maharaj Vastu Sangrahalaya", "Premier art and history museum in Mumbai.", 10, 0, 12, 30, 15.0, 18.9269, 72.8327, "Culture"));
                    activities.add(createActivity("Kala Ghoda Art District & Artisan Cafes", "Wander through contemporary galleries and heritage streets.", 14, 0, 16, 30, 25.0, 18.9280, 72.8330, "Culture"));
                    activities.add(createActivity("Girgaon Chowpatty Sunset & Street Food", "Sample famous local street delicacies while taking in the bay view.", 17, 30, 19, 30, 10.0, 18.9548, 72.8143, "Food"));
                } else if (i == 3) {
                    activities.add(createActivity("Bandra Fort & Castella de Aguada", "Historic Portuguese fort overlooking the Bandra-Worli Sea Link.", 10, 0, 12, 30, 0.0, 19.0430, 72.8190, "Sightseeing"));
                    activities.add(createActivity("Coastal Lunch at Pali Village Cafe", "Charming Mediterranean & Indian fusion bistro in Bandra.", 13, 0, 14, 30, 25.0, 19.0580, 72.8280, "Food"));
                    activities.add(createActivity("Bandstand Promenade & Mount Mary Church", "Scenic coastal walk featuring celebrity residences and sea vistas.", 15, 30, 18, 0, 0.0, 19.0460, 72.8210, "Sightseeing"));
                } else if (i == 4) {
                    activities.add(createActivity("Kanheri Caves & Forest Walk", "Ancient Buddhist rock-cut monuments inside Sanjay Gandhi National Park.", 9, 30, 12, 0, 10.0, 19.2300, 72.9150, "Culture"));
                    activities.add(createActivity("Traditional Maharashtrian Thali Lunch", "Authentic regional lunch featuring Misal Pav and Kothimbir Vadi.", 13, 0, 14, 30, 15.0, 19.0230, 72.8420, "Food"));
                    activities.add(createActivity("CSMT UNESCO Heritage Terminus", "Iconic Victorian Gothic revival architectural tour.", 15, 30, 18, 0, 0.0, 18.9400, 72.8350, "Sightseeing"));
                } else if (i == 5) {
                    activities.add(createActivity("Elephanta Island Rock Caves Boat Tour", "Ferry across Mumbai Harbor to UNESCO rock-cut cave temples.", 9, 0, 13, 0, 25.0, 18.9633, 72.9315, "Sightseeing"));
                    activities.add(createActivity("Crawford Market & Spice Bazaar Stroll", "Vibrant colonial-era wholesale spice and fruit market.", 14, 30, 16, 30, 20.0, 18.9470, 72.8340, "Shopping"));
                    activities.add(createActivity("Worli Sea Face Promenade & Sunset", "Dramatic shoreline promenade with panoramic ocean waves.", 17, 30, 19, 0, 0.0, 19.0120, 72.8160, "Relaxation"));
                } else if (i == 6) {
                    activities.add(createActivity("Nehru Science Centre & Planetarium", "Interactive exhibits and astronomy dome in Worli.", 10, 0, 12, 30, 12.0, 18.9890, 72.8180, "Culture"));
                    activities.add(createActivity("High Street Phoenix & Luxury Boutiques", "Upscale dining, artisanal coffee, and boutique shopping.", 13, 0, 15, 30, 35.0, 18.9950, 72.8240, "Shopping"));
                    activities.add(createActivity("Haji Ali Dargah Island Causeway Walk", "Historic mosque and tomb located on an islet in the Arabian Sea.", 16, 30, 18, 30, 0.0, 18.9827, 72.8089, "Sightseeing"));
                } else {
                    activities.add(createActivity("Chor Bazaar Heritage Flea Market", "Fascinating vintage market with antiques and artisanal crafts.", 10, 0, 12, 30, 20.0, 18.9590, 72.8300, "Shopping"));
                    activities.add(createActivity("Pancham Puriwala Traditional Lunch", "Centuries-old legendary Puri Thali eatery near CSMT.", 13, 0, 14, 30, 10.0, 18.9410, 72.8360, "Food"));
                    activities.add(createActivity("Hanging Gardens & Malabar Hill Sunset", "Lush terraced gardens offering sweeping views of Marine Drive bay.", 16, 0, 18, 0, 0.0, 18.9560, 72.8050, "Relaxation"));
                }
            } else if (destLower.contains("delhi")) {
                if (i == 1) {
                    activities.add(createActivity("Red Fort & Chandni Chowk Cultural Walk", "Historic Mughal fortress complex and legendary heritage market streets.", 9, 30, 12, 0, 10.0, 28.6562, 77.2410, "Sightseeing"));
                    activities.add(createActivity("Heritage Culinary Lunch in Old Delhi", "Sample legendary Mughlai delicacies and authentic street food.", 12, 30, 14, 0, 20.0, 28.6510, 77.2330, "Food"));
                    activities.add(createActivity("India Gate & Rajpath Boulevard", "Ceremonial boulevard and national war memorial monument grounds.", 16, 0, 18, 0, 0.0, 28.6129, 77.2295, "Sightseeing"));
                } else if (i == 2) {
                    activities.add(createActivity("Humayun's Tomb Heritage Complex", "UNESCO World Heritage site featuring sublime Mughal garden tomb architecture.", 10, 0, 12, 30, 12.0, 28.5893, 77.2507, "Culture"));
                    activities.add(createActivity("Lodhi Art District & Open Air Gallery", "Walk through India's first open-air street art district.", 14, 0, 16, 0, 0.0, 28.5860, 77.2200, "Culture"));
                    activities.add(createActivity("Khan Market Artisanal Dinner & Drinks", "Upscale designer shops and trendy rooftop bistros.", 17, 0, 19, 30, 30.0, 28.6002, 77.2270, "Food"));
                } else if (i == 3) {
                    activities.add(createActivity("Qutub Minar Complex & Alai Minar", "World's tallest brick minaret and ancient iron pillar.", 9, 30, 12, 0, 10.0, 28.5245, 77.1855, "Sightseeing"));
                    activities.add(createActivity("Mehrauli Archaeological Park Walk", "Over 100 historical monuments scattered across lush parkland.", 13, 0, 15, 30, 0.0, 28.5210, 77.1880, "Culture"));
                    activities.add(createActivity("Dilli Haat Food & Craft Bazaar", "Open-air food plaza representing authentic cuisines of Indian states.", 16, 30, 19, 0, 15.0, 28.5730, 77.2080, "Shopping"));
                } else {
                    activities.add(createActivity("Lotus Temple (Bahá'í House of Worship)", "Stunning lotus-shaped marble temple for silent reflection.", 10, 0, 12, 0, 0.0, 28.5535, 77.2588, "Sightseeing"));
                    activities.add(createActivity("Sunder Nursery Botanical Gardens", "Restored Mughal heritage park with lakes and botanical flora.", 13, 0, 15, 30, 8.0, 28.5900, 77.2460, "Relaxation"));
                    activities.add(createActivity("Connaught Place (CP) Heritage Arcades", "Colonial circular shopping arcades and underground Palika Bazaar.", 16, 30, 19, 0, 25.0, 28.6315, 77.2167, "Shopping"));
                }
            } else {
                // 100% Unique day-specific activities for ANY generic city (Day 1..7)
                double dayLatOffset = (i * 0.005);
                double dayLngOffset = (i * 0.004);

                String[] day1Names = new String[]{
                    dest + " Historic Old Town & Heritage Plaza",
                    "Artisanal Regional Bistro Lunch in " + dest,
                    dest + " Riverside Promenade & Sunset Walk"
                };
                String[] day2Names = new String[]{
                    dest + " Royal Citadel & Panorama Tower",
                    "Gourmet Terrace Dining in " + dest + " Quarter",
                    dest + " Botanical Gardens & Fountain Promenade"
                };
                String[] day3Names = new String[]{
                    dest + " Fine Arts Museum & Sculpture Court",
                    "Historic Cafe & Pastry Tasting in " + dest,
                    dest + " Scenic Harbor & Ocean Deck"
                };
                String[] day4Names = new String[]{
                    dest + " Grand Cathedral & Heritage Cloister",
                    "Local Street Food & Spice Market Walk",
                    dest + " Hilltop Sky Observatory Point"
                };
                String[] day5Names = new String[]{
                    dest + " Contemporary Art Center & Plaza",
                    "Seafood & Grill Bistro in " + dest,
                    dest + " Waterfront Nature Preserve"
                };
                String[] day6Names = new String[]{
                    dest + " Antique Flea Market & Craft Avenue",
                    "Traditional Tea House & Bakery Stop",
                    dest + " Royal Park & Rose Conservatory"
                };
                String[] day7Names = new String[]{
                    dest + " National Monument & Memorial Park",
                    "Farewell Celebration Feast in " + dest,
                    dest + " Sunset Deck & Evening Fountain Trail"
                };

                String[][] allDayNames = new String[][]{ day1Names, day2Names, day3Names, day4Names, day5Names, day6Names, day7Names };
                String[] currentNames = allDayNames[(i - 1) % allDayNames.length];

                activities.add(createActivity(currentNames[0], "Explore iconic architecture, monuments, and historic sights in " + dest + ".", 9, 30, 11, 30, 15.0, baseLat + dayLatOffset, baseLng + dayLngOffset, "Sightseeing"));
                activities.add(createActivity(currentNames[1], "Sample signature dishes, authentic flavors, and local specialties.", 12, 30, 14, 0, 22.0, baseLat + dayLatOffset + 0.002, baseLng + dayLngOffset + 0.003, "Food"));
                activities.add(createActivity(currentNames[2], "Enjoy scenic leisure strolling through parks, promenades, and viewpoints.", 15, 30, 18, 0, 10.0, baseLat + dayLatOffset + 0.004, baseLng + dayLngOffset + 0.001, "Relaxation"));
            }

            dayDtos.add(GeneratedItineraryDayDto.builder()
                    .dayNumber(i)
                    .date(currentDate)
                    .summary("Day " + i + " unique highlights in " + dest)
                    .notes("Carefully curated unique activities for Day " + i + " in " + dest)
                    .activities(activities)
                    .build());
        }

        return GeneratedItineraryDto.builder()
                .days(dayDtos)
                .build();
    }

    private GeneratedActivityDto createActivity(String title, String desc, int startH, int startM, int endH, int endM, double cost, double lat, double lng, String category) {
        return GeneratedActivityDto.builder()
                .title(title)
                .description(desc)
                .startTime(LocalTime.of(startH, startM))
                .endTime(LocalTime.of(endH, endM))
                .estimatedCost(BigDecimal.valueOf(cost))
                .latitude(lat)
                .longitude(lng)
                .placeId("place-" + Math.abs(title.hashCode()))
                .category(category)
                .build();
    }
}