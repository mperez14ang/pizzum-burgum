package uy.um.edu.pizzumburgum.dto.request;

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
public class CreationRequest {
    private Long id;

    private String name;

    private CreationType type;

    private Set<CreationHasProductsRequest> products;
}
