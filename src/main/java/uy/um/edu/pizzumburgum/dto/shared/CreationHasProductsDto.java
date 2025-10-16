package uy.um.edu.pizzumburgum.dto.shared;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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
