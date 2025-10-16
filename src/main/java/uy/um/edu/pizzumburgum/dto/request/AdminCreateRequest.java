package uy.um.edu.pizzumburgum.dto.request;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.SuperBuilder;

@EqualsAndHashCode(callSuper = true)
@Data
@SuperBuilder
public class AdminCreateRequest extends UserCreateRequest {

    private String createdById;
}
