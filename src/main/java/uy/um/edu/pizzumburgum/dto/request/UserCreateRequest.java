package uy.um.edu.pizzumburgum.dto.request;

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

    private String password;

    private LocalDate birthDate;

    private String dni;
}
