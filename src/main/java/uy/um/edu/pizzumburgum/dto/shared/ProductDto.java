package uy.um.edu.pizzumburgum.dto.shared;

import lombok.*;
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

    private ProductCategory productCategory;

    private Boolean available;

}
