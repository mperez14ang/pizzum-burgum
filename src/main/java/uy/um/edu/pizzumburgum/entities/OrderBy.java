package uy.um.edu.pizzumburgum.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Entity
@Table(name = "order_by")
@NoArgsConstructor
@AllArgsConstructor
@Data
public class OrderBy {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Solo puede ser como los elementos de OrderState
    @Enumerated(EnumType.STRING)
    @Column(name = "state",  nullable = false)
    private OrderState state;

    @ManyToOne
    @JoinColumn(name = "to_deliver", nullable = false)
    private Address address;

    @OneToMany(cascade = CascadeType.ALL)
    private Set<OrderHasCreations> creations;

    @ManyToOne
    @JoinColumn(name = "client_order", nullable = false)
    private Client client;
}
