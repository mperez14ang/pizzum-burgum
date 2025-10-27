package uy.um.edu.pizzumburgum.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "order_by")
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
@ToString(exclude = {"creations", "client"})
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
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

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    @Builder.Default
    private Set<OrderHasCreations> creations = new HashSet<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    private Client client;
}
