package uy.um.edu.pizzum_burgum.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Entity
@Table(name = "addresses")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "La calle es obligatoria")
    @Column(nullable = false, length = 100)
    private String street;

    @NotBlank(message = "La ciudad es obligatoria")
    @Column(nullable = false, length = 50)
    private String city;

    @NotBlank(message = "El código postal es obligatorio")
    @Column(name = "postal_code", nullable = false, length = 10)
    private String postalCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @ToString.Exclude
    private User user;

    @Column(nullable = false)
    @Builder.Default
    private Boolean active = true;

}

