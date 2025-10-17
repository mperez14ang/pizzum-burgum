package uy.um.edu.pizzumburgum.dto.response;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;

@Data
@SuperBuilder
@NoArgsConstructor
public class UserDtoResponse {

    private String email;

    private String username;

    private String lastName;

    private LocalDate birthDate;
}
