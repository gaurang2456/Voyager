package dev.kishore.voyager.mapper;

import dev.kishore.voyager.dto.ai.GeneratedActivityDto;
import dev.kishore.voyager.dto.ai.GeneratedItineraryDayDto;
import dev.kishore.voyager.dto.ai.GeneratedItineraryDto;
import dev.kishore.voyager.dto.response.ActivityResponse;
import dev.kishore.voyager.dto.response.ItineraryDayResponse;
import dev.kishore.voyager.dto.response.ItineraryResponse;
import dev.kishore.voyager.entity.Activity;
import dev.kishore.voyager.entity.Itinerary;
import dev.kishore.voyager.entity.ItineraryDay;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ItineraryMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "trip", ignore = true)
    @Mapping(target = "generatedAt", ignore = true)
    @Mapping(target = "version", ignore = true)
    Itinerary toEntity(GeneratedItineraryDto dto);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "itinerary", ignore = true)
    ItineraryDay toDayEntity(GeneratedItineraryDayDto dto);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "itineraryDay", ignore = true)
    Activity toActivityEntity(GeneratedActivityDto dto);

    @Mapping(source = "trip.id", target = "tripId")
    ItineraryResponse toResponse(Itinerary itinerary);

    ItineraryDayResponse toDayResponse(ItineraryDay itineraryDay);

    ActivityResponse toActivityResponse(Activity activity);

    @AfterMapping
    default void linkRelationships(@MappingTarget Itinerary itinerary) {
        if (itinerary.getDays() != null) {
            for (ItineraryDay day : itinerary.getDays()) {
                day.setItinerary(itinerary);
                if (day.getActivities() != null) {
                    for (Activity activity : day.getActivities()) {
                        activity.setItineraryDay(day);
                    }
                }
            }
        }
    }
}
