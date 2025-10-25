package uy.um.edu.pizzumburgum.mapper;

import uy.um.edu.pizzumburgum.dto.request.CreationHasProductsRequest;
import uy.um.edu.pizzumburgum.dto.response.CreationHasProductsResponse;
import uy.um.edu.pizzumburgum.entities.CreationHasProducts;

public class CreationHasProductMapper {

    public static CreationHasProducts toCreationHasProducts(CreationHasProductsRequest creationHasProductsRequest) {
        return CreationHasProducts.builder()
                .id(creationHasProductsRequest.getId())
                .quantity(creationHasProductsRequest.getQuantity())
                .build();
    }

    public static CreationHasProductsResponse toCreationHasProductsDto(CreationHasProducts creationHasProducts) {
        return CreationHasProductsResponse.builder()
                .id(creationHasProducts.getId())
                .product(ProductMapper.toProductDto(creationHasProducts.getProduct()))
                .quantity(creationHasProducts.getQuantity())
                .build();
    }
}
