package uy.um.edu.pizzumburgum.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uy.um.edu.pizzumburgum.dto.shared.ProductDto;
import uy.um.edu.pizzumburgum.entities.CreationType;
import uy.um.edu.pizzumburgum.entities.ProductCategory;
import uy.um.edu.pizzumburgum.entities.ProductType;

import java.math.BigDecimal;
import java.util.Set;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CartItemResponse {
    private Long itemId; // ID del OrderHasCreations
    private Long creationId;
    private String creationName; // "Pizza Personalizada"
    private CreationType type; // PIZZA / BURGER / EXTRA
    private ProductType extraType; // Si es EXTRA aplica
    private Set<ProductDto> ingredients;
    private BigDecimal unitPrice;
    private Integer quantity;
    private BigDecimal subtotal;
    private String image;
}