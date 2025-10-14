package uy.um.edu.pizzumburgum.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Entity
@Table(name = "card")
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class Card {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "stripe_id", nullable = false)
    private String stripeId;

    @Column(name = "brand")
    private String brand;

    @Pattern(regexp = "\\d{4}", message = "Debe contener exactamente 4 números")
    @Column(name = "last_4_digits", nullable = false)
    private String last4Digits;

    @Min(0)
    @Max(9999)
    @Column(name = "exp_year", nullable = false)
    private int expirationYear;

    @Min(1)
    @Max(12)
    @Column(name = "exp_month", nullable = false)
    private int expirationMonth;

    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name = "has_cards", nullable = false)
    private Client clients;

}
