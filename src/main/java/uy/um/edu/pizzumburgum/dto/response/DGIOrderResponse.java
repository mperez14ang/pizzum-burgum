package uy.um.edu.pizzumburgum.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uy.um.edu.pizzumburgum.entities.OrderState;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Set;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DGIOrderResponse {
    private Long id;
    private OrderState state;
    private LocalDate dateCreated;
    private String deliveryStreet;
    private String deliveryCity;
    private String deliveryPostalCode;
    private BigDecimal extraAmount;
    private BigDecimal totalPrice;
    private String clientEmail;
    private String clientName;
    private String clientDni;
    private String notes;
}