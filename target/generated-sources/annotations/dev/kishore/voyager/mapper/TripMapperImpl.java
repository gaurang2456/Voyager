package dev.kishore.voyager.mapper;

import dev.kishore.voyager.dto.request.CreateTripRequest;
import dev.kishore.voyager.dto.request.UpdateTripRequest;
import dev.kishore.voyager.dto.response.TripResponse;
import dev.kishore.voyager.entity.Trip;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-07-21T23:28:11+0530",
    comments = "version: 1.6.3, compiler: javac, environment: Java 26.0.1 (Oracle Corporation)"
)
@Component
public class TripMapperImpl implements TripMapper {

    @Override
    public Trip toEntity(CreateTripRequest request) {
        if ( request == null ) {
            return null;
        }

        Trip.TripBuilder trip = Trip.builder();

        trip.destination( request.getDestination() );
        trip.startDate( request.getStartDate() );
        trip.endDate( request.getEndDate() );
        trip.budget( request.getBudget() );

        return trip.build();
    }

    @Override
    public TripResponse toResponse(Trip trip) {
        if ( trip == null ) {
            return null;
        }

        TripResponse.TripResponseBuilder tripResponse = TripResponse.builder();

        tripResponse.id( trip.getId() );
        tripResponse.destination( trip.getDestination() );
        tripResponse.startDate( trip.getStartDate() );
        tripResponse.endDate( trip.getEndDate() );
        tripResponse.budget( trip.getBudget() );

        return tripResponse.build();
    }

    @Override
    public List<TripResponse> toResponseList(List<Trip> trips) {
        if ( trips == null ) {
            return null;
        }

        List<TripResponse> list = new ArrayList<TripResponse>( trips.size() );
        for ( Trip trip : trips ) {
            list.add( toResponse( trip ) );
        }

        return list;
    }

    @Override
    public void updateTripFromRequest(UpdateTripRequest request, Trip trip) {
        if ( request == null ) {
            return;
        }

        trip.setTitle( request.getTitle() );
        trip.setDestination( request.getDestination() );
        trip.setStartDate( request.getStartDate() );
        trip.setEndDate( request.getEndDate() );
        trip.setBudget( request.getBudget() );
        trip.setCurrency( request.getCurrency() );
    }
}
