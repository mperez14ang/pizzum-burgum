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
@DiscriminatorValue(UserType.CLIENT)
public class Client extends User {
    @OneToMany(mappedBy = "client", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    private Set<Address> addresses = new HashSet<>();

    // Cada cliente tiene una tabla de favoritos
    @OneToMany(mappedBy = "client", cascade = {CascadeType.PERSIST, CascadeType.MERGE}, orphanRemoval = true)
    @ToString.Exclude
    private Set<Favorites> favorites = new HashSet<>();

    // El atributo esta en la tabla order_by
    @OneToMany(mappedBy = "client", cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    private Set<OrderBy> orders = new HashSet<>();

    // El atributo esta en la tabla card
    @OneToMany(mappedBy = "client", cascade = {CascadeType.PERSIST, CascadeType.MERGE},
            orphanRemoval = true, fetch = FetchType.EAGER)
    private Set<Card> cards = new HashSet<>();

    @Column(name = "stripe_customer_id", unique = true)
    private String stripeCustomerId;

    @Override
    public String getUserType() {return UserType.CLIENT;}
}