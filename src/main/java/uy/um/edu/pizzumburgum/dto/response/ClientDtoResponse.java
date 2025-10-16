package uy.um.edu.pizzumburgum.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uy.um.edu.pizzumburgum.dto.shared.AddressDto;
import uy.um.edu.pizzumburgum.dto.shared.FavoritesDto;

import java.time.LocalDate;
import java.util.Set;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ClientDtoResponse {
    private String email;

    private String username;

    private String lastName;

    private LocalDate birthDate;

    private Set<AddressDto> addresses;

    private Set<FavoritesDto> favorites;
}
