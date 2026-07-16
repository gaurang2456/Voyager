package dev.kishore.voyager.entity;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "trips")
public class Trip {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String destination;

    private LocalDate startDate;

    private LocalDate endDate;

    private Double budget;

    private String currency;

    @ManyToOne
    @JoinColumn(name = "owner_id")
    private User owner;
}