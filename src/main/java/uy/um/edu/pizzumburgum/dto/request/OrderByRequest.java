package uy.um.edu.pizzumburgum.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uy.um.edu.pizzumburgum.entities.OrderState;

import java.util.Set;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderByRequest {
    private OrderState state;

    private Long address;

    private Set<OrderHasCreationsRequest> creations;

    private String clientEmail;
}
