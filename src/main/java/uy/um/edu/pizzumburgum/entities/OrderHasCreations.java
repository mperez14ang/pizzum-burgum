package uy.um.edu.pizzumburgum.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(
        name = "order_has_creation"
)
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class OrderHasCreations {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Min(1)
    @Column(name = "quantity")
    private int quantity;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn
    private Creation creation;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn
    private OrderBy order;
}
