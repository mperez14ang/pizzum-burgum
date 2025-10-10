package uy.um.edu.pizzumburgum.entities;

import jakarta.annotation.Nullable;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.SuperBuilder;

@EqualsAndHashCode(callSuper = true)
@Entity
@DiscriminatorValue("admin")
@Data
@NoArgsConstructor
@SuperBuilder
public class Admin extends User{
    @NotBlank(message = "Debe de especificar el nivel del usuario")
    @Column(nullable = false)
    private int level;

    @ManyToOne
    @JoinColumn(name = "created_by")
    @Nullable
    private Admin createdBy;
}
