package uy.um.edu.pizzumburgum.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CheckoutRequest {
    @NotNull(message = "Debe seleccionar una divisa")
    @Pattern(regexp = "^(usd|eur|gbp|jpy|cad|aud|chf|cny|uyu)$",
            message = "Moneda no soportada. Use: usd, eur, gbp, jpy, cad, aud, chf, cny, uyu")
    private String currency;
}