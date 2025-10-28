package uy.um.edu.pizzumburgum.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uy.um.edu.pizzumburgum.entities.CreationType;

import java.util.Set;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AddToCartRequest {

    @NotNull(message = "El email del cliente es obligatorio")
    private String clientEmail;

    @NotNull(message = "El tipo de creación es obligatorio")
    private CreationType type;

    @NotEmpty(message = "Debe seleccionar al menos un ingrediente")
    private Set<CreationHasProductsRequest> products;

    @NotNull(message = "La cantidad es obligatoria")
    @Min(value = 1, message = "La cantidad debe ser al menos 1")
    private Integer quantity;
}