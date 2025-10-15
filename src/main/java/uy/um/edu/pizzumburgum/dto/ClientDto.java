package uy.um.edu.pizzumburgum.dto;

import lombok.*;

import java.time.LocalDate;
import java.util.Set;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ClientDto {

    private String email;

    private String userName;

    private String lastName;

    private String password;

    private LocalDate birthDate;

    private String dni;

    private Set<AddressDto> addresses;

    private Set<FavoritesDto> favorites;
}
