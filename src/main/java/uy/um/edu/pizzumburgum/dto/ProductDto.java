package uy.um.edu.pizzumburgum.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import uy.um.edu.pizzumburgum.entities.ProductType;

import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductDto {

    private Long id;

    private String name;

    private BigDecimal price;

    private ProductType productType;


    private String description;
}
