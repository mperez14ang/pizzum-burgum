package uy.um.edu.pizzumburgum.dto.shared;

import lombok.*;
import uy.um.edu.pizzumburgum.entities.OrderState;

import java.util.Set;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderByDto {

    private Long id;

    private OrderState state;

    private AddressDto address;

    private Set<OrderHasCreationsDto> items;

}