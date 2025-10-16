package uy.um.edu.pizzumburgum.dto.request;

import lombok.*;
import uy.um.edu.pizzumburgum.dto.shared.AddressDto;
import uy.um.edu.pizzumburgum.dto.shared.FavoritesDto;

import java.time.LocalDate;
import java.util.Set;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ClientCreateRequest {

    private String email;

    private String username;

    private String lastName;

    private String password;

    private LocalDate birthDate;

    private String dni;

    private Set<AddressDto> addresses;

    private Set<FavoritesDto> favorites;
}
