package dev.kishore.voyager.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "destinations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Destination {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String placeName;

    private String country;

    private Integer days;

    private String notes;

    @ManyToOne
    @JoinColumn(name = "trip_id")
    private Trip trip;
}