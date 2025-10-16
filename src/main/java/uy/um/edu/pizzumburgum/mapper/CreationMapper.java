package uy.um.edu.pizzumburgum.mapper;

import uy.um.edu.pizzumburgum.dto.shared.CreationDto;
import uy.um.edu.pizzumburgum.dto.shared.CreationHasProductsDto;
import uy.um.edu.pizzumburgum.dto.shared.OrderHasCreationsDto;
import uy.um.edu.pizzumburgum.entities.Creation;
import uy.um.edu.pizzumburgum.entities.CreationHasProducts;
import uy.um.edu.pizzumburgum.entities.OrderHasCreations;
import uy.um.edu.pizzumburgum.repository.CreationHasProductsRepository;
import uy.um.edu.pizzumburgum.repository.OrderHasCreationsRepository;

import java.util.HashSet;
import java.util.Set;

public class CreationMapper {
    public static CreationDto toCreationDto(Creation creation) {
        // Convertir creationsHasProducts a creationsHasProductsDto
        Set<CreationHasProductsDto> creationsHasProductsDtos = new HashSet<>();
        for (CreationHasProducts creationHasProducts : creation.getProducts()){
            creationsHasProductsDtos.add(CreationHasProductMapper.toCreationHasProductsDto(creationHasProducts));
        }

        // Convertir orderHasCreations a orderHasCreationsDto
        Set<OrderHasCreationsDto> orderHasCreationsDtos = new HashSet<>();
        for (OrderHasCreations orderHasCreation : creation.getOrder()){
            orderHasCreationsDtos.add(OrderHasCreationsMapper.toOrderHasCreationsDto(orderHasCreation));
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

    public static Creation toCreation(
            CreationDto creationDto, CreationHasProductsRepository creationHasProductsRepository, OrderHasCreationsRepository orderHasCreationsRepository
    ) {
        // Convertir creationsHasProductsDto a creationsHasProducts
        Set<CreationHasProducts> creationsHasProducts = new HashSet<>();
        for (CreationHasProductsDto creationHasProductsDto : creationDto.getProducts()){
            creationsHasProducts.add(
                    creationHasProductsRepository.findById(creationHasProductsDto.getId()).
                            orElseThrow(() -> new RuntimeException("No se encontro CreationHasProducts"))
            );
        }

        // Convertir OrderHasCreationsDto a OrderHasCreations
        Set<OrderHasCreations> orderHasCreations = new HashSet<>();
        for (OrderHasCreationsDto orderHasCreationsDto : creationDto.getOrders()){
            orderHasCreations.add(
                    orderHasCreationsRepository.findById(orderHasCreationsDto.getId()).
                            orElseThrow(() -> new RuntimeException("No se encontro OrderHasCreations"))
            );
        }

        return Creation.builder()
                .id(creationDto.getId())
                .name(creationDto.getName())
                .price(creationDto.getPrice())
                .type(creationDto.getType())
                .products(creationsHasProducts)
                .order(orderHasCreations)
                .build();
    }
}
