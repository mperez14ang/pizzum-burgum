package uy.um.edu.pizzumburgum.mapper;

import uy.um.edu.pizzumburgum.dto.request.OrderHasCreationsRequest;
import uy.um.edu.pizzumburgum.dto.response.OrderHasCreationsResponse;
import uy.um.edu.pizzumburgum.entities.OrderHasCreations;

public class OrderHasCreationsMapper {
    public static OrderHasCreations toOrderHasCreations(OrderHasCreationsRequest orderHasCreationsRequest) {

        return OrderHasCreations.builder()
                .id(orderHasCreationsRequest.getId())
                .quantity(orderHasCreationsRequest.getQuantity())
                .build();
    }

    public static OrderHasCreationsResponse toOrderHasCreationsDto(OrderHasCreations orderHasCreations) {
        return OrderHasCreationsResponse.builder()
                .quantity(orderHasCreations.getQuantity())
                .creation(CreationMapper.toCreationDto(orderHasCreations.getCreation()))
                .build();
    }
}
