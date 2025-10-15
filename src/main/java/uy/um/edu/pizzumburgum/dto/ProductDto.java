package uy.um.edu.pizzumburgum.dto;

import lombok.*;
import uy.um.edu.pizzumburgum.entities.CreationHasProducts;
import uy.um.edu.pizzumburgum.entities.ProductType;

import java.math.BigDecimal;
import java.util.Set;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductDto {

    private Long id;

    private String name;

    private float price;

    private ProductType type;

    private Set<CreationHasProductsDto> creations;
}
