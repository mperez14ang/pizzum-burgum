package uy.um.edu.pizzum_burgum.entities;

import uy.um.edu.pizzum_burgum.entities.*;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import org.springframework.security.core.userdetails.UserDetails;

@Entity
@Table(name = "users")
@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorColumn(name = "user_type", discriminatorType = DiscriminatorType.STRING)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public abstract class User implements UserDetails{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El nombre es obligatorio")
    @Size(min = 2, max = 50)
    @Column(nullable = false, length = 50)
    private String nombre;

    @NotBlank(message = "El apellido es obligatorio")
    @Size(min = 2, max = 50)
    @Column(nullable = false, length = 50)
    private String apellido;

    @NotNull(message = "La fecha de nacimiento es obligatoria")
    @Past(message = "La fecha de nacimiento debe ser en el pasado")
    @Column(name = "fecha_nacimiento", nullable = false)
    private LocalDate fechaNacimiento;

    @NotBlank(message = "La cédula es obligatoria")
    @Pattern(regexp = "\\d{7,8}", message = "La cédula debe tener 7 u 8 dígitos")
    @Column(unique = true, nullable = false, length = 8)
    private String ci;

    @NotBlank(message = "El email es obligatorio")
    @Email(message = "Email inválido")
    @Column(unique = true, nullable = false, length = 100)
    private String mail;

    @NotBlank(message = "La contraseña es obligatoria")
    @Size(min = 8, message = "La contraseña debe tener al menos 8 caracteres")
    @Column(nullable = false)
    private String password;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<Address> addresses = new HashSet<>();

    @Override
    public String getUsername() {
        return mail;
    }


    @Override
    public String getPassword() {
        return password;
    }


    public void addAddress(Address address) {
        addresses.add(address);
        address.setUser(this);
    }


    public void removeAddress(Address address) {
        addresses.remove(address);
        address.setUser(null);
    }

}
