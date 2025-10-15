package uy.um.edu.pizzumburgum.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CreationHasProductsDto {
    private Long id;

    private int quantity;

    private Long product;

    private Long creation;

}
