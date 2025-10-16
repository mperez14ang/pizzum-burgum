package uy.um.edu.pizzumburgum.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;

@Data
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
public class UserCreateRequest {
    private String email;

    private String username;

    private String lastName;

    private String password;

    private LocalDate birthDate;

    private String dni;
}
