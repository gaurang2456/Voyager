package dev.kishore.voyager.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true)
    private String email;

    private String password;

    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "owner")
    private List<Trip> trips;
}