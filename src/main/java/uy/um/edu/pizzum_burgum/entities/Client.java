package uy.um.edu.pizzum_burgum.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.Set;

@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "client")
@Data
@NoArgsConstructor
@SuperBuilder
public class Client extends User {

    // Cada cliente tiene una tabla de favoritos
    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private Set<Favorites> favorites;

    // El atributo esta en la tabla order_by
    @OneToMany
    private Set<OrderBy> orders;

    // El atributo esta en la tabla card
    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private Set<Card> cards;
}
