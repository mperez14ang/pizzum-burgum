package uy.um.edu.pizzumburgum.dto.shared;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CardDto {

    private Long id;

    private String stripeId;

    private String brand;

    private String last4Digits;

    private int expirationYear;

    private int expirationMonth;

    private String clientId;
}
