package uy.um.edu.pizzumburgum.dto.response;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;

@Data
@SuperBuilder
@NoArgsConstructor
public class UserResponse {

    private String email;

    private String firstName;

    private String lastName;

    private LocalDate birthDate;

    private LocalDate createdDate;

    private String userType;

    private String profileUrl;

    private String dni;
}
