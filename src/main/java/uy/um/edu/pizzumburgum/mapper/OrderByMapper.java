package uy.um.edu.pizzumburgum.mapper;

import uy.um.edu.pizzumburgum.dto.shared.OrderByDto;
import uy.um.edu.pizzumburgum.entities.OrderBy;

public class OrderByMapper {
    public static OrderBy toOrderBy(OrderByDto orderByDto) {
        return OrderBy.builder()
                .id(orderByDto.getId())
                .state(orderByDto.getState())
                .build();
    }

    public static OrderByDto toOrderByDto(OrderBy orderBy) {
        return OrderByDto.builder()
                .id(orderBy.getId())
                .state(orderBy.getState())
                .build();
    }
}
