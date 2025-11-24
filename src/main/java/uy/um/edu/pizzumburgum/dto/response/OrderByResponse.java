package uy.um.edu.pizzumburgum.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uy.um.edu.pizzumburgum.entities.OrderState;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderByResponse {
    private Long id;

    private OrderState state;

    private String deliveryStreet;

    private String deliveryCity;

    private String deliveryPostalCode;

    private Set<OrderHasCreationsResponse> creations;

    private BigDecimal extraAmount;

    private BigDecimal totalPrice;

    private String clientEmail;

    private String notes;

    private LocalDateTime dateCreated;

    private String clientName;

    private Boolean available;
}
