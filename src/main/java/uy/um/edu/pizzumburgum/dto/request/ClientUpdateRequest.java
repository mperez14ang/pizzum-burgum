package uy.um.edu.pizzumburgum.dto.request;

import lombok.*;
import lombok.experimental.SuperBuilder;

@EqualsAndHashCode(callSuper = true)
@Data
@SuperBuilder
public class ClientUpdateRequest extends UserUpdateRequest {
}

