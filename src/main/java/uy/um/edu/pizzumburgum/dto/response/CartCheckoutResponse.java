package uy.um.edu.pizzumburgum.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CartCheckoutResponse {
    private OrderByResponse orderBy;

    private String currency;

    private AddressResponse address;

    private BigDecimal total;

    private LocalDateTime date;

    private String paymentStatus;
}
