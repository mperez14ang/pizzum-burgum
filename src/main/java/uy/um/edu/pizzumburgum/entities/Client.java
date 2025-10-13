package uy.um.edu.pizzumburgum.entities;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "client")
@Data
@NoArgsConstructor
@SuperBuilder
@EqualsAndHashCode(exclude = "addresses", callSuper = false)
@ToString(exclude = "addresses")
public class Client extends User {

    @OneToMany(mappedBy = "client", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<Address> addresses = new HashSet<>();

    // Cada cliente tiene una tabla de favoritos
    @OneToMany(mappedBy = "client", cascade = {CascadeType.PERSIST, CascadeType.MERGE}, orphanRemoval = true)
    @Builder.Default
    private Set<Favorites> favorites = new HashSet<>();

    // El atributo esta en la tabla order_by
    @OneToMany
    private Set<OrderBy> orders;

    // El atributo esta en la tabla card
    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private Set<Card> cards;
}