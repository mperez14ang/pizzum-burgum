package uy.um.edu.pizzumburgum.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(
        name = "creation_has_products",
        uniqueConstraints = @UniqueConstraint(columnNames = {"creation_id", "product_id"})
)
@NoArgsConstructor
@AllArgsConstructor
@Data
public class CreationHasProducts {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Min(1)
    @Column(name = "quantity")
    private int quantity;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "creation_id")
    private Creation creation;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "product_id")
    private Product product;
}
