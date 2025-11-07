package uy.um.edu.pizzumburgum.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "order_by")
@EntityListeners(AuditingEntityListener.class)
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

    @Column(nullable = false)
    private String deliveryStreet;

    @Column(nullable = false)
    private String deliveryCity;

    @Column(nullable = false)
    private String deliveryPostalCode;

    @Min(0)
    private BigDecimal extraAmount;

    private String notes;

    @CreatedDate
    @Column(name = "date_created", nullable = false, updatable = false)
    private LocalDate dateCreated;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    @Builder.Default
    private Set<OrderHasCreations> creations = new HashSet<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    private Client client;

    public void setAddress(Address address) {
        this.deliveryStreet = address.getStreet();
        this.deliveryCity = address.getCity();
        this.deliveryPostalCode = address.getPostalCode();
    }
}
