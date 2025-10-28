package uy.um.edu.pizzumburgum.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uy.um.edu.pizzumburgum.dto.request.OrderHasCreationsRequest;
import uy.um.edu.pizzumburgum.entities.OrderState;

import java.util.Set;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderByResponse {
    private Long id;

    private OrderState state;

    private AddressResponse address;

    private Set<OrderHasCreationsResponse> creations;

    private String clientEmail;

    private String clientName;

    private Boolean available;
}
