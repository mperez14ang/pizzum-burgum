package uy.um.edu.pizzumburgum.dto.response;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uy.um.edu.pizzumburgum.dto.shared.FavoritesDto;

import java.util.Set;

@EqualsAndHashCode(callSuper = true)
@Data
@SuperBuilder
@NoArgsConstructor
public class ClientResponse extends UserResponse {

    private Set<AddressResponse> addresses;

    private Set<FavoritesDto> favorites;
}
