package uy.um.edu.pizzumburgum.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CreationHasProductsRequest {
    private Long id;

    private int quantity;

    private Long productId;

}
