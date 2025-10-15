package uy.um.edu.pizzumburgum.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import uy.um.edu.pizzumburgum.entities.CreationHasProducts;
import uy.um.edu.pizzumburgum.entities.ProductCategory;
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

    private BigDecimal price;

    private ProductType productType;

    private Set<CreationHasProductsDto> creations;
    private ProductCategory productCategory;

    private String description;
}
