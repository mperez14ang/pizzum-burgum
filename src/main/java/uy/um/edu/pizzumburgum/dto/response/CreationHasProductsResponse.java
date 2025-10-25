package uy.um.edu.pizzumburgum.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uy.um.edu.pizzumburgum.dto.shared.ProductDto;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CreationHasProductsResponse {
    private int quantity;

    private ProductDto product;

}
