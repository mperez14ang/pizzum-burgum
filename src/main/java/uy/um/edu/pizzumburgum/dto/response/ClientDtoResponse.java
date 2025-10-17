package uy.um.edu.pizzumburgum.dto.response;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uy.um.edu.pizzumburgum.dto.shared.AddressDto;
import uy.um.edu.pizzumburgum.dto.shared.FavoritesDto;

import java.util.Set;

@EqualsAndHashCode(callSuper = true)
@Data
@SuperBuilder
@NoArgsConstructor
public class ClientDtoResponse extends UserDtoResponse {

    private Set<AddressDto> addresses;

    private Set<FavoritesDto> favorites;
}
