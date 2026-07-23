package dev.kishore.voyager.mapper;

import dev.kishore.voyager.dto.request.CreateDestinationRequest;
import dev.kishore.voyager.dto.request.UpdateDestinationRequest;
import dev.kishore.voyager.dto.response.DestinationResponse;
import dev.kishore.voyager.entity.Destination;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface DestinationMapper {

    Destination toEntity(CreateDestinationRequest request);

    DestinationResponse toResponse(Destination destination);

    List<DestinationResponse> toResponseList(List<Destination> list);

    void updateFromRequest(UpdateDestinationRequest request,
                           @MappingTarget Destination destination);
}