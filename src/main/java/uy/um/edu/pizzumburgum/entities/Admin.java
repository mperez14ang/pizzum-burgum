package uy.um.edu.pizzumburgum.entities;

import jakarta.annotation.Nullable;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@EqualsAndHashCode(callSuper = true)
@Entity
@DiscriminatorValue("admin")
@Data
@NoArgsConstructor
@SuperBuilder
public class Admin extends User{
    @ManyToOne
    @JoinColumn(name = "created_by")
    @Nullable
    private Admin createdBy;
}
