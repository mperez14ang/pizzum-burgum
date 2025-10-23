package uy.um.edu.pizzumburgum.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "favorites")
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
@EqualsAndHashCode(exclude = {"client", "creations"})
@ToString(exclude = "client")
public class Favorites {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "date_created", nullable = false)
    private LocalDateTime dateCreated;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    private Client client;

    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE}, fetch = FetchType.EAGER)
    @JoinTable(
        name = "favorites_creation",
        joinColumns = @JoinColumn(name = "favorites_id"),
        inverseJoinColumns = @JoinColumn(name = "creation_id")
    )
    private Set<Creation> creations;

    @PrePersist
    protected void onCreate() {
        dateCreated = LocalDateTime.now();
    }
}
