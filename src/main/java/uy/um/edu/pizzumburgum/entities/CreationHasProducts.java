package uy.um.edu.pizzumburgum.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Table(
        name = "creation_has_products",
        uniqueConstraints = @UniqueConstraint(columnNames = {"creation_id", "product_id"})
)
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class CreationHasProducts {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Min(1)
    @Column(name = "quantity")
    private int quantity;

    @ManyToOne
    @JoinColumn(name = "creation_id")
    private Creation creation;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    // Custom equals and hashCode to avoid issues with Set when id is null
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        CreationHasProducts that = (CreationHasProducts) o;

        // If both have ids, compare by id
        if (id != null && that.id != null) {
            return id.equals(that.id);
        }

        // If no ids, compare by product (to avoid Set collisions)
        if (product != null && that.product != null) {
            return product.getId() != null && product.getId().equals(that.product.getId());
        }

        return false;
    }

    @Override
    public int hashCode() {
        // Use product id for hashCode to ensure proper Set behavior
        if (product != null && product.getId() != null) {
            return product.getId().hashCode();
        }
        return 0;
    }
}
