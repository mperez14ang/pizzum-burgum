package uy.um.edu.pizzumburgum.dto.response;

import lombok.*;
import lombok.experimental.SuperBuilder;
import uy.um.edu.pizzumburgum.dto.shared.AddressDto;
import uy.um.edu.pizzumburgum.dto.shared.FavoritesDto;

import java.time.LocalDate;
import java.util.Set;

@EqualsAndHashCode(callSuper = true)
@Data
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
public class ClientDtoResponse extends UserDtoResponse {

    private Set<AddressDto> addresses;

    private Set<FavoritesDto> favorites;
}
