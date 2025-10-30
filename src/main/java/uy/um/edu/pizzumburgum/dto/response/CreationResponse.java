package uy.um.edu.pizzumburgum.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uy.um.edu.pizzumburgum.dto.request.CreationHasProductsRequest;
import uy.um.edu.pizzumburgum.entities.CreationType;

import java.util.Set;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CreationResponse {
    private Long id;

    private String name;

    private CreationType type;

    private float price;

    private Set<CreationHasProductsResponse> products;

    private Boolean available;
}
