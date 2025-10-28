package uy.um.edu.pizzumburgum.mapper;

import uy.um.edu.pizzumburgum.dto.response.CreationHasProductsResponse;
import uy.um.edu.pizzumburgum.dto.request.CreationRequest;
import uy.um.edu.pizzumburgum.dto.response.CreationResponse;
import uy.um.edu.pizzumburgum.entities.Creation;
import uy.um.edu.pizzumburgum.entities.CreationHasProducts;
import uy.um.edu.pizzumburgum.entities.OrderHasCreations;
import uy.um.edu.pizzumburgum.entities.Product;

import java.util.Set;
import java.util.logging.Logger;
import java.util.stream.Collectors;

public class CreationMapper {

    public static CreationResponse toCreationDto(Creation creation) {
        // Convertir creationsHasProducts a creationsHasProductsDto
        Set<CreationHasProductsResponse> creationsHasProductsDtos = creation.getProducts()
                .stream()
                .map(CreationHasProductMapper::toCreationHasProductsDto)
                .collect(Collectors.toSet());

        boolean productsAvailable = creation.getProducts().stream()
                .map(CreationHasProducts::getProduct)
                .allMatch(p -> Boolean.TRUE.equals(p.getAvailable()) && !Boolean.TRUE.equals(p.getDeleted()));

        creation.setAvailable(productsAvailable);

        return CreationResponse.builder()
                .id(creation.getId())
                .name(creation.getName())
                .price(creation.getPrice())
                .type(creation.getType())
                .products(creationsHasProductsDtos)
                .available(productsAvailable)
                .build();
    }

    public static Creation toCreation(CreationRequest creationDto) {
        Creation creation = Creation.builder()
                .name(creationDto.getName())
                .price(creationDto.getPrice())
                .type(creationDto.getType())
                .available(true)
                .build();

        if (creation.getId() != null) {
            creation.setId(creationDto.getId());
        }

        return creation;
    }
}
