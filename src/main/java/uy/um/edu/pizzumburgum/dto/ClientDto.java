package uy.um.edu.pizzumburgum.dto;

import jakarta.persistence.Id;
import lombok.*;

import java.time.LocalDate;
import java.util.Set;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ClientDto {

    @Id
    private String email;

    private String username;

    private String lastName;

    private String password;

    private LocalDate birthDate;

    private String dni;

    private Set<AddressDto> addresses;
}
