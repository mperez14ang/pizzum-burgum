package uy.um.edu.pizzumburgum.dto.request;

import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;

@Data
@SuperBuilder
@NoArgsConstructor
public class UserCreateRequest {
    private String email;

    private String firstName;

    private String lastName;

    @Size(min = 8, message = "La contraseña debe tener al menos 8 caracteres")
    private String password;

    private LocalDate birthDate;

    private String dni;
}
