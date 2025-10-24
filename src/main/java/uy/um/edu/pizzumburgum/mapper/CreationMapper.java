package uy.um.edu.pizzumburgum.mapper;

import uy.um.edu.pizzumburgum.dto.shared.CreationDto;
import uy.um.edu.pizzumburgum.dto.shared.CreationHasProductsDto;
import uy.um.edu.pizzumburgum.dto.shared.OrderHasCreationsDto;
import uy.um.edu.pizzumburgum.entities.Creation;
import uy.um.edu.pizzumburgum.entities.CreationHasProducts;
import uy.um.edu.pizzumburgum.entities.OrderHasCreations;

import java.util.Collections;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

public class CreationMapper {
    public static CreationDto toCreationDto(Creation creation) {
        // Convertir creationsHasProducts a creationsHasProductsDto
        Set<CreationHasProductsDto> creationsHasProductsDtos = creation.getProducts()
                .stream()
                .map(CreationHasProductMapper::toCreationHasProductsDto)
                .collect(Collectors.toSet());

        Set<OrderHasCreationsDto> orderHasCreationsDtos = creation.getOrder()
                .stream()
                .map(OrderHasCreationsMapper::toOrderHasCreationsDto)
                .collect(Collectors.toSet());


        return CreationDto.builder()
                .id(creation.getId())
                .name(creation.getName())
                .price(creation.getPrice())
                .type(creation.getType())
                .products(creationsHasProductsDtos)
                .orders(orderHasCreationsDtos)
                .build();
    }

    public static Creation toCreation(CreationDto creationDto) {
        Creation creation = Creation.builder()
                .name(creationDto.getName())
                .price(creationDto.getPrice())
                .type(creationDto.getType())
                .build();

        if (creation.getId() != null) {
            creation.setId(creationDto.getId());
        }

        return creation;
    }
}
