package uy.um.edu.pizzumburgum.dto.request;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentRequest {

    @NotBlank(message = "El email del cliente es obligatorio")
    @Email(message = "El email debe ser válido")
    private String clientEmail;

    @NotNull(message = "El ID de la tarjeta es obligatorio")
    private Long cardId;

    @NotNull(message = "El monto es obligatorio")
    @DecimalMin(value = "0.01", message = "El monto debe ser mayor a 0")
    private BigDecimal amount;

    @NotBlank(message = "La moneda es obligatoria")
    @Pattern(regexp = "^(usd|eur|gbp|jpy|cad|aud|chf|cny|uyu)$",
            message = "Moneda no soportada. Use: usd, eur, gbp, jpy, cad, aud, chf, cny, uyu")
    private String currency;

    private String description;
}