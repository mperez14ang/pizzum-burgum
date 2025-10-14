package uy.um.edu.pizzumburgum.dto;

import jakarta.persistence.Id;
import lombok.*;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserDto {

    private String email;

    private String username;

    private String lastName;

    private String password;

    private LocalDate birthDate;

    private String dni;
}
