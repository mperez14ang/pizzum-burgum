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
@DiscriminatorValue(UserType.CLIENT)
public class Client extends User {

    @OneToMany(mappedBy = "client", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Address> addresses = new HashSet<>();

    // Cada cliente tiene una tabla de favoritos
    @OneToMany(mappedBy = "client", cascade = {CascadeType.PERSIST, CascadeType.MERGE}, fetch = FetchType.EAGER, orphanRemoval = true)
    private Set<Favorites> favorites = new HashSet<>();

    // El atributo esta en la tabla order_by
    @OneToMany(mappedBy = "client", cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    private Set<OrderBy> orders = new HashSet<>();

    // El atributo esta en la tabla card
    @OneToMany(mappedBy = "client", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private Set<Card> cards;

    // Helper method to add favorite with proper bidirectional sync
    public void addFavorite(Favorites favorite) {
        if (this.favorites == null) {
            this.favorites = new HashSet<>();
        }
        this.favorites.add(favorite);
        favorite.setClient(this);
    }

    @Override
    public String getUserType() {return UserType.CLIENT;}
}