package uy.um.edu.pizzumburgum.mapper;

import uy.um.edu.pizzumburgum.dto.OrderHasCreationsDto;
import uy.um.edu.pizzumburgum.entities.Creation;
import uy.um.edu.pizzumburgum.entities.OrderBy;
import uy.um.edu.pizzumburgum.entities.OrderHasCreations;
import uy.um.edu.pizzumburgum.repository.CreationRepository;
import uy.um.edu.pizzumburgum.repository.OrderByRepository;

public class OrderHasCreationsMapper {
    public static OrderHasCreations toOrderHasCreations(
            OrderHasCreationsDto orderHasCreationsDto, CreationRepository creationRepository, OrderByRepository orderByRepository) {
        // De CreationDto a Creation
        Creation creation = null;
        if (orderHasCreationsDto.getCreationId() != null) {
            creation = creationRepository.findById(orderHasCreationsDto.getCreationId())
                    .orElseThrow(() -> new RuntimeException("No se encontro la creacion"));
        }

        // De OrderByDto a OrderBy
        OrderBy orderBy = null;
        if (orderHasCreationsDto.getOrderId() != null) {
            orderBy = orderByRepository.findById(orderHasCreationsDto.getOrderId())
                    .orElseThrow(() -> new RuntimeException("No se encontro la orden"));
        }

        return OrderHasCreations.builder()
                .id(orderHasCreationsDto.getId())
                .quantity(orderHasCreationsDto.getQuantity())
                .creation(creation)
                .order(orderBy)
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
