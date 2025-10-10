package uy.um.edu.pizzumburgum.dto;

import lombok.*;

import java.time.LocalDate;
import java.util.Set;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ClientDto {
    private Long id;

    private String name;

    private String lastName;

    private String password;

    private LocalDate birthDate;

    private String dni;

    private String mail;

    private Set<AddressDto> addresses;
}
