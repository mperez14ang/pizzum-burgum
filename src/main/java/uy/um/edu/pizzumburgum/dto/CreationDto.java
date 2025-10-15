package uy.um.edu.pizzumburgum.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uy.um.edu.pizzumburgum.entities.CreationType;
import uy.um.edu.pizzumburgum.entities.OrderHasCreations;

import java.util.Set;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CreationDto {
    private Long id;

    private String name;

    private CreationType type;

    private float price;

    private Set<CreationHasProductsDto> products;

    private Set<OrderHasCreationsDto> orders;
}
