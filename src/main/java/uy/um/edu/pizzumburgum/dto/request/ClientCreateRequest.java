package uy.um.edu.pizzumburgum.dto.request;

import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.Set;

@EqualsAndHashCode(callSuper = true)
@Data
@SuperBuilder
@NoArgsConstructor
public class ClientCreateRequest extends UserCreateRequest {

    private Set<AddressRequest> addresses;
}
