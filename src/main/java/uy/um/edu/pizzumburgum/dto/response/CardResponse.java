package uy.um.edu.pizzumburgum.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CardResponse {
    private Long id;

    private String brand;

    private String protectedNumber;

    private long expirationYear;

    private long expirationMonth;

    private String clientId;
}
