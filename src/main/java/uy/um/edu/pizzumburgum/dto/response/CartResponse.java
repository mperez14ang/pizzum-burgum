package uy.um.edu.pizzumburgum.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CartResponse {
    private Long orderId;
    private String state;
    private String clientEmail;
    private String clientName;
    private String deliveryStreet;
    private String deliveryCity;
    private String deliveryPostalCode;
    private List<CartItemResponse> items;
    private BigDecimal total;
    private Integer totalItems;
    private Boolean available;
}