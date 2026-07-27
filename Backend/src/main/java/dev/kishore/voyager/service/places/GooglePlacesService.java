package dev.kishore.voyager.service.places;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import dev.kishore.voyager.exception.PlacesServiceException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.math.BigDecimal;
import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Slf4j
@Service
@RequiredArgsConstructor
public class GooglePlacesService {

    @Value("${google.places.api-key:}")
    private String apiKey;

    private final ObjectMapper objectMapper;
    private final RestClient restClient = RestClient.create();

    private record SearchCategoryTask(String textQuery, String uiCategory) {}

    public List<RealPlaceDto> getRealPlacesForDestination(String destination) {
        if (destination == null || destination.isBlank()) {
            throw new PlacesServiceException("Destination name is required.");
        }

        if (apiKey == null || apiKey.isBlank()) {
            log.error("GOOGLE_PLACES_API_KEY is not configured in environment or properties.");
            throw new PlacesServiceException("Unable to retrieve places for this destination. (GOOGLE_PLACES_API_KEY is missing)");
        }

        String safeDest = destination.trim();
        log.info("Fetching real Google Places API (New) POIs for destination '{}' concurrently across 7 categories...", safeDest);

        List<SearchCategoryTask> tasks = List.of(
                new SearchCategoryTask("Tourist attractions in " + safeDest, "Sightseeing"),
                new SearchCategoryTask("Landmarks in " + safeDest, "Sightseeing"),
                new SearchCategoryTask("Museums in " + safeDest, "Culture"),
                new SearchCategoryTask("Parks & Nature in " + safeDest, "Relaxation"),
                new SearchCategoryTask("Restaurants in " + safeDest, "Food"),
                new SearchCategoryTask("Cafes in " + safeDest, "Food"),
                new SearchCategoryTask("Shopping in " + safeDest, "Shopping")
        );

        Map<String, RealPlaceDto> deduplicatedPlaces = new LinkedHashMap<>();

        try (ExecutorService executor = Executors.newVirtualThreadPerTaskExecutor()) {
            List<CompletableFuture<List<RealPlaceDto>>> futures = tasks.stream()
                    .map(task -> CompletableFuture.supplyAsync(() -> fetchCategoryFromGooglePlaces(task.textQuery(), task.uiCategory()), executor))
                    .toList();

            CompletableFuture.allOf(futures.toArray(new CompletableFuture[0])).join();

            for (CompletableFuture<List<RealPlaceDto>> future : futures) {
                try {
                    List<RealPlaceDto> places = future.join();
                    for (RealPlaceDto p : places) {
                        if (p.getPlaceId() != null && !deduplicatedPlaces.containsKey(p.getPlaceId())) {
                            deduplicatedPlaces.put(p.getPlaceId(), p);
                        }
                    }
                } catch (Exception e) {
                    log.warn("One of the Google Places category queries failed: {}", e.getMessage());
                }
            }
        } catch (Exception e) {
            log.error("Failed executing concurrent Google Places API requests for destination '{}': {}", safeDest, e.getMessage(), e);
            throw new PlacesServiceException("Unable to retrieve places for this destination. Please try again later.", e);
        }

        if (deduplicatedPlaces.isEmpty()) {
            log.error("Google Places API (New) returned 0 valid places for destination '{}'", safeDest);
            throw new PlacesServiceException("Unable to retrieve places for this destination.");
        }

        List<RealPlaceDto> result = new ArrayList<>(deduplicatedPlaces.values());
        log.info("Successfully fetched {} unique real Google Places for destination '{}'", result.size(), safeDest);
        return result;
    }

    private List<RealPlaceDto> fetchCategoryFromGooglePlaces(String textQuery, String uiCategory) {
        List<RealPlaceDto> places = new ArrayList<>();
        try {
            Map<String, Object> requestBody = Map.of(
                    "textQuery", textQuery,
                    "maxResultCount", 10
            );

            String responseJson = restClient.post()
                    .uri("https://places.googleapis.com/v1/places:searchText")
                    .header("Content-Type", MediaType.APPLICATION_JSON_VALUE)
                    .header("X-Goog-Api-Key", apiKey.trim())
                    .header("X-Goog-FieldMask", "places.id,places.displayName,places.primaryType,places.primaryTypeDisplayName,places.location,places.rating,places.priceLevel,places.formattedAddress")
                    .body(requestBody)
                    .retrieve()
                    .body(String.class);

            if (responseJson == null || responseJson.isBlank()) {
                return places;
            }

            JsonNode root = objectMapper.readTree(responseJson);
            JsonNode placesNode = root.get("places");
            if (placesNode != null && placesNode.isArray()) {
                for (JsonNode node : placesNode) {
                    RealPlaceDto dto = parseSinglePlace(node, uiCategory);
                    if (dto != null) {
                        places.add(dto);
                    }
                }
            }
        } catch (Exception e) {
            log.warn("Google Places API call failed for query '{}': {}", textQuery, e.getMessage());
        }
        return places;
    }

    private RealPlaceDto parseSinglePlace(JsonNode node, String defaultUiCategory) {
        if (node == null || !node.has("id") || node.get("id").asText().isBlank()) {
            return null;
        }

        String placeId = node.get("id").asText();

        String name = placeId;
        if (node.has("displayName") && node.get("displayName").has("text")) {
            name = node.get("displayName").get("text").asText();
        }

        double lat = 0.0;
        double lng = 0.0;
        if (node.has("location")) {
            JsonNode loc = node.get("location");
            if (loc.has("latitude")) lat = loc.get("latitude").asDouble();
            if (loc.has("longitude")) lng = loc.get("longitude").asDouble();
        }

        double rating = node.has("rating") ? node.get("rating").asDouble() : 4.5;
        String priceLevelStr = node.has("priceLevel") ? node.get("priceLevel").asText() : null;
        String address = node.has("formattedAddress") ? node.get("formattedAddress").asText() : null;

        BigDecimal estimatedCost = mapPriceLevelToCost(priceLevelStr);

        String description = (address != null && !address.isBlank())
                ? address
                : "Popular " + defaultUiCategory + " destination.";

        return RealPlaceDto.builder()
                .placeId(placeId)
                .name(name)
                .category(defaultUiCategory)
                .latitude(lat)
                .longitude(lng)
                .rating(rating)
                .priceLevel(priceLevelStr)
                .formattedAddress(address)
                .estimatedCost(estimatedCost)
                .description(description)
                .build();
    }

    private BigDecimal mapPriceLevelToCost(String priceLevel) {
        if (priceLevel == null) return BigDecimal.valueOf(15.0);
        return switch (priceLevel) {
            case "PRICE_LEVEL_FREE" -> BigDecimal.valueOf(0.0);
            case "PRICE_LEVEL_INEXPENSIVE" -> BigDecimal.valueOf(10.0);
            case "PRICE_LEVEL_MODERATE" -> BigDecimal.valueOf(25.0);
            case "PRICE_LEVEL_EXPENSIVE" -> BigDecimal.valueOf(50.0);
            case "PRICE_LEVEL_VERY_EXPENSIVE" -> BigDecimal.valueOf(100.0);
            default -> BigDecimal.valueOf(15.0);
        };
    }
}
