package dev.kishore.voyager.service;

import dev.kishore.voyager.entity.Trip;
import dev.kishore.voyager.entity.User;
import dev.kishore.voyager.repository.TripRepository;
import dev.kishore.voyager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AIItineraryService {

    private final ChatClient chatClient;
    private final TripRepository tripRepository;
    private final UserRepository userRepository;

    private User getCurrentUser() {
        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public String generateItinerary(Long tripId) {

        Trip trip = tripRepository
                .findByIdAndUser(tripId, getCurrentUser())
                .orElseThrow(() -> new RuntimeException("Trip not found"));

        String prompt = buildPrompt(trip);

        return chatClient.prompt(prompt)
                .call()
                .content();
    }

    private String buildPrompt(Trip trip) {

        return """
                You are an expert travel planner.

                Create a detailed travel itinerary.

                Trip Title: %s

                Destination: %s

                Description: %s

                Start Date: %s

                End Date: %s

                Budget: %s %s

                Return ONLY valid JSON.

                Format:

                {
                  "days":[
                    {
                      "day":1,
                      "activities":[
                        "Activity 1",
                        "Activity 2"
                      ]
                    }
                  ]
                }
                """
                .formatted(
                        trip.getTitle(),
                        trip.getDestination(),
                        trip.getDescription(),
                        trip.getStartDate(),
                        trip.getEndDate(),
                        trip.getBudget(),
                        trip.getCurrency()
                );
    }
}