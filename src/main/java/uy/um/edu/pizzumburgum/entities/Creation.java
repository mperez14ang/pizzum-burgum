package uy.um.edu.pizzumburgum.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import lombok.*;

import java.util.Set;

@Entity
@Table(name = "creation")
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
@ToString(exclude = {"products", "order"})
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Creation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private CreationType type;

    @Min(0)
    @Column(name="price")
    private float price;

    @Column(name = "available")
    private Boolean available;

    @OneToMany(mappedBy = "creation", cascade = CascadeType.ALL)
    private Set<CreationHasProducts> products;

    @OneToMany(mappedBy = "creation", cascade = CascadeType.ALL)
    private Set<OrderHasCreations> order;

}