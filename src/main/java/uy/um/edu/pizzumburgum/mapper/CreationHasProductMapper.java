package uy.um.edu.pizzumburgum.mapper;

import uy.um.edu.pizzumburgum.dto.shared.CreationHasProductsDto;
import uy.um.edu.pizzumburgum.entities.CreationHasProducts;

public class CreationHasProductMapper {
    public static CreationHasProductsDto toCreationHasProductsDto(CreationHasProducts creationHasProducts) {
        return CreationHasProductsDto.builder()
                .id(creationHasProducts.getId())
                .productId(creationHasProducts.getProduct().getId())
                .quantity(creationHasProducts.getQuantity())
                .build();
    }

    public static CreationHasProducts toCreationHasProducts(CreationHasProductsDto creationHasProductsDto) {
        return CreationHasProducts.builder()
                .id(creationHasProductsDto.getId())
                .quantity(creationHasProductsDto.getQuantity())
                .build();
    }
}
