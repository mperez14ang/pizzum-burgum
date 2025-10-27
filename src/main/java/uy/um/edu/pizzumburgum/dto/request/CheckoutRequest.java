package uy.um.edu.pizzumburgum.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CheckoutRequest {

    @NotNull(message = "Debe seleccionar una dirección de entrega")
    private Long addressId;

    @NotNull(message = "Debe seleccionar un método de pago")
    private String paymentMethod; // "EFECTIVO", "TARJETA", "MERCADO_PAGO", etc.
}