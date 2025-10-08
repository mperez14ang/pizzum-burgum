package uy.um.edu.pizzum_burgum.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Entity
@Table(name = "product")
@NoArgsConstructor
@AllArgsConstructor
@Data
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Min(0)
    @Column(name = "price", nullable = false)
    private int price;

    @Column(name = "type", nullable = false)
    private int type;

    @OneToMany(cascade = CascadeType.ALL)
    private Set<CreationHasProducts> creation;
}
