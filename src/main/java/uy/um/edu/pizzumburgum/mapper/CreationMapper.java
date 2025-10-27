package uy.um.edu.pizzumburgum.mapper;

import uy.um.edu.pizzumburgum.dto.response.CreationHasProductsResponse;
import uy.um.edu.pizzumburgum.dto.request.CreationRequest;
import uy.um.edu.pizzumburgum.dto.response.CreationResponse;
import uy.um.edu.pizzumburgum.entities.Creation;

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

        return CreationResponse.builder()
                .id(creation.getId())
                .name(creation.getName())
                .price(creation.getPrice())
                .type(creation.getType())
                .products(creationsHasProductsDtos)
                .build();
    }

    public static Creation toCreation(CreationRequest creationDto) {
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
