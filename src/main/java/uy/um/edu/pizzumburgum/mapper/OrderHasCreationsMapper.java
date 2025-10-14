package uy.um.edu.pizzumburgum.mapper;

import uy.um.edu.pizzumburgum.dto.OrderHasCreationsDto;
import uy.um.edu.pizzumburgum.entities.Creation;
import uy.um.edu.pizzumburgum.entities.OrderBy;
import uy.um.edu.pizzumburgum.entities.OrderHasCreations;

import java.util.HashSet;
import java.util.Set;

public class OrderHasCreationsMapper {
    public static OrderHasCreations toOrderHasCreations(OrderHasCreationsDto orderHasCreationsDto) {
        // De CreationDto a Creation
        Set<Creation> creationDtos = new HashSet<>();

        // De OrderByDto a OrderBy
        Set<OrderBy> orderHasCreations = new HashSet<>();

        OrderHasCreations orderHasCreations = OrderHasCreations.builder()
                .id(orderHasCreationsDto.getId())
                .quantity(orderHasCreationsDto.getQuantity())
                .creation(creationDtos)
                .order()
                .build();
    }

    public static OrderHasCreationsDto toOrderHasCreationsDto(OrderHasCreations orderHasCreations) {
        return null;
    }
}
