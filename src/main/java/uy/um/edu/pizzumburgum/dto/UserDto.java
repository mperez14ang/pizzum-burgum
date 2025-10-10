package uy.um.edu.pizzumburgum.dto;

import lombok.*;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserDto {
    private Long id;

    private String name;

    private String lastName;

    private String password;

    private LocalDate birthDate;

    private String dni;

    private String mail;
}
