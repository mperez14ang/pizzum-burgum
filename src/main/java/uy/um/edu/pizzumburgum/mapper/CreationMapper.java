package uy.um.edu.pizzumburgum.mapper;

import uy.um.edu.pizzumburgum.dto.CreationDto;
import uy.um.edu.pizzumburgum.dto.CreationHasProductsDto;
import uy.um.edu.pizzumburgum.entities.Creation;
import uy.um.edu.pizzumburgum.entities.CreationHasProducts;
import uy.um.edu.pizzumburgum.entities.OrderHasCreations;

import java.util.HashSet;
import java.util.Set;

public class CreationMapper {
    public static CreationDto toCreationDto(Creation creation) {
        // Convertir creationsHasProducts a creationsHasProductsDto
        Set<CreationHasProductsDto> productsDto = new HashSet<>();
        for (CreationHasProducts product : creation.getProducts()){
            productsDto.add(CreationHasProductMapper.toCreationHasProductsDto(product));
        }

        // Convertir orderHasCreations a orderHasCreationsDto
        Set<OrderHasCreations> orderHasCreationsDtos = new HashSet<>();
        for (OrderHasCreations orderHasCreation : creation.getOrder()){
            productsDto.add(CreationHasProductMapper.toCreationHasProductsDto(product));
        }

        CreationDto creationDto = CreationDto.builder()
                .id(creation.getId())
                .name(creation.getName())
                .price(creation.getPrice())
                .type(creation.getType())
                .products(productsDto)
                .orders()
                .build();
    }

    public static Creation toCreation(CreationDto creationDto) {

    }
}
