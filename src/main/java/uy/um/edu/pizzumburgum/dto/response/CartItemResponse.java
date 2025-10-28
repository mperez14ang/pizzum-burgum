package uy.um.edu.pizzumburgum.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uy.um.edu.pizzumburgum.dto.shared.ProductDto;

import java.util.Set;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CartItemResponse {
    private Long itemId; // ID del OrderHasCreations
    private Long creationId;
    private String creationName; // "Pizza Personalizada"
    private String creationType; // PIZZA / BURGER
    private Set<ProductDto> ingredients;
    private Float unitPrice;
    private Integer quantity;
    private Float subtotal;
    private String image;
}