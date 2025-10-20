package uy.um.edu.pizzumburgum.dto.request;

import lombok.*;
import lombok.experimental.SuperBuilder;
import uy.um.edu.pizzumburgum.dto.response.AddressResponse;
import uy.um.edu.pizzumburgum.dto.shared.FavoritesDto;

import java.util.Set;

@EqualsAndHashCode(callSuper = true)
@Data
@SuperBuilder
@NoArgsConstructor
public class ClientCreateRequest extends UserCreateRequest {

    private Set<AddressRequest> addresses;

    private Set<FavoritesDto> favorites;
}
