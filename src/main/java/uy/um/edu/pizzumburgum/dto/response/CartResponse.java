package uy.um.edu.pizzumburgum.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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
    private AddressResponse deliveryAddress;
    private List<CartItemResponse> items;
    private Float total;
    private Integer totalItems;
}