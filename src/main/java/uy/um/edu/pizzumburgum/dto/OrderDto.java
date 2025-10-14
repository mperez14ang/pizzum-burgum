package uy.um.edu.pizzumburgum.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import uy.um.edu.pizzumburgum.entities.OrderState;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderDto {

    private Long id;
    private OrderState state;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private BigDecimal subtotal;
    private BigDecimal deliveryCost;
    private BigDecimal total;
    private String clientEmail;

    private Long addressId;

    private Long cardId;

    private Set<OrderItemDto> items;

}