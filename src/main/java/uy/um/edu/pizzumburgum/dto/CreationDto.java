package uy.um.edu.pizzumburgum.dto;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uy.um.edu.pizzumburgum.entities.CreationType;

import java.util.Set;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CreationDto {
    @Id
    private Long id;

    private String name;

    private CreationType type;

    private float price;

    private Set<CreationHasProductsDto> products;
}
