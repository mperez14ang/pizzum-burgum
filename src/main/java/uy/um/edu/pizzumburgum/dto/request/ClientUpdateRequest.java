package uy.um.edu.pizzumburgum.dto.request;

import lombok.*;
import lombok.experimental.SuperBuilder;

@EqualsAndHashCode(callSuper = true)
@Data
@SuperBuilder
@NoArgsConstructor
public class ClientUpdateRequest extends UserUpdateRequest {
}

