package uy.um.edu.pizzumburgum.dto.request;

import lombok.*;
import lombok.experimental.SuperBuilder;
import uy.um.edu.pizzumburgum.dto.shared.AddressDto;
import uy.um.edu.pizzumburgum.dto.shared.FavoritesDto;

import java.time.LocalDate;
import java.util.Set;

@EqualsAndHashCode(callSuper = true)
@Data
@SuperBuilder
public class ClientCreateRequest extends UserCreateRequest {

    private Set<AddressDto> addresses;

    private Set<FavoritesDto> favorites;
}
