package uy.um.edu.pizzumburgum.mapper;

import uy.um.edu.pizzumburgum.dto.CreationHasProductsDto;
import uy.um.edu.pizzumburgum.entities.Creation;
import uy.um.edu.pizzumburgum.entities.CreationHasProducts;
import uy.um.edu.pizzumburgum.entities.Product;
import uy.um.edu.pizzumburgum.repository.CreationRepository;
import uy.um.edu.pizzumburgum.repository.ProductRepository;

public class CreationHasProductMapper {
    public static CreationHasProductsDto toCreationHasProductsDto(CreationHasProducts creationHasProducts) {
        return CreationHasProductsDto.builder()
                .id(creationHasProducts.getId())
                .creation(creationHasProducts.getCreation().getId())
                .product(creationHasProducts.getProduct().getId())
                .quantity(creationHasProducts.getQuantity())
                .build();
    }

    public static CreationHasProducts toCreationHasProducts(
            CreationHasProductsDto creationHasProductsDto, CreationRepository creationRepository,
            ProductRepository productRepository) {

        // Buscar la creacion
        Creation creation = null;
        if (creationHasProductsDto.getCreation() != null) {
            creation = creationRepository.findById(creationHasProductsDto.getCreation())
                    .orElseThrow(() -> new RuntimeException("No se encontro la creacion"));
        }

        // Buscar el producto
        Product product = null;
        if (creationHasProductsDto.getProduct() != null) {
            product = productRepository.findById(creationHasProductsDto.getProduct())
                    .orElseThrow(() -> new RuntimeException("No se encontro el producto"));
        }

        assert creation != null;
        return CreationHasProducts.builder()
                .id(creationHasProductsDto.getId())
                .creation(creation)
                .product(product)
                .build();
    }
}
