package dev.kishore.voyager.mapper;

import dev.kishore.voyager.dto.request.CreateTripRequest;
import dev.kishore.voyager.dto.response.TripResponse;
import dev.kishore.voyager.entity.Trip;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface TripMapper {

    Trip toEntity(CreateTripRequest request);

    TripResponse toResponse(Trip trip);
}