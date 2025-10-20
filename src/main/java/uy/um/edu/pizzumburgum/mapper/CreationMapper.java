package uy.um.edu.pizzumburgum.mapper;

import uy.um.edu.pizzumburgum.dto.shared.CreationDto;
import uy.um.edu.pizzumburgum.dto.shared.CreationHasProductsDto;
import uy.um.edu.pizzumburgum.dto.shared.OrderHasCreationsDto;
import uy.um.edu.pizzumburgum.entities.Creation;
import uy.um.edu.pizzumburgum.entities.CreationHasProducts;
import uy.um.edu.pizzumburgum.entities.OrderHasCreations;

import java.util.HashSet;
import java.util.Set;

public class CreationMapper {
    public static CreationDto toCreationDto(Creation creation) {
        // Convertir creationsHasProducts a creationsHasProductsDto
        Set<CreationHasProductsDto> creationsHasProductsDtos = new HashSet<>();
        if (creation.getProducts() != null) {
            for (CreationHasProducts creationHasProducts : creation.getProducts()){
                creationsHasProductsDtos.add(CreationHasProductMapper.toCreationHasProductsDto(creationHasProducts));
            }
        }

        // Convertir orderHasCreations a orderHasCreationsDto
        Set<OrderHasCreationsDto> orderHasCreationsDtos = new HashSet<>();
        if (creation.getOrder() != null) {
            for (OrderHasCreations orderHasCreation : creation.getOrder()){
                orderHasCreationsDtos.add(OrderHasCreationsMapper.toOrderHasCreationsDto(orderHasCreation));
            }
        }

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
        return Creation.builder()
                .id(creationDto.getId())
                .name(creationDto.getName())
                .price(creationDto.getPrice())
                .type(creationDto.getType())
                .build();
    }
}
