package dev.kishore.voyager.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TripPhotoRequest {

    private String url;

    private String title;

    private String locationName;
}
