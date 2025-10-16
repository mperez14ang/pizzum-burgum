package uy.um.edu.pizzumburgum.dto.shared;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDtoRequest {

    private String email;

    private String userName;

    private String lastName;

    private String password;

    private LocalDate birthDate;

    private String dni;
}
