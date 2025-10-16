package uy.um.edu.pizzumburgum.mapper;

import uy.um.edu.pizzumburgum.dto.shared.OrderHasCreationsDto;
import uy.um.edu.pizzumburgum.entities.OrderHasCreations;

public class OrderHasCreationsMapper {
    public static OrderHasCreations toOrderHasCreations(OrderHasCreationsDto orderHasCreationsDto) {

        return OrderHasCreations.builder()
                .id(orderHasCreationsDto.getId())
                .quantity(orderHasCreationsDto.getQuantity())
                .build();
    }

    public static OrderHasCreationsDto toOrderHasCreationsDto(OrderHasCreations orderHasCreations) {
        return OrderHasCreationsDto.builder()
                .id(orderHasCreations.getId())
                .quantity(orderHasCreations.getQuantity())
                .creationId(orderHasCreations.getCreation().getId())
                .orderId(orderHasCreations.getOrder().getId())
                .build();
    }
}
