package uy.um.edu.pizzumburgum.mapper;

import uy.um.edu.pizzumburgum.dto.CreationHasProductsDto;
import uy.um.edu.pizzumburgum.dto.ProductDto;
import uy.um.edu.pizzumburgum.entities.CreationHasProducts;
import uy.um.edu.pizzumburgum.entities.Product;
import uy.um.edu.pizzumburgum.repository.CreationRepository;
import uy.um.edu.pizzumburgum.repository.ProductRepository;

import java.util.HashSet;
import java.util.Set;

public class ProductMapper {
    public static ProductDto toProductDto(Product product) {
        // Agregar creationsDto
        Set<CreationHasProductsDto> creationsDto = new HashSet<>();
        for (CreationHasProducts creationHasProducts : product.getCreations()) {
            creationsDto.add(CreationHasProductMapper.toCreationHasProductsDto(creationHasProducts));
        }

        return ProductDto.builder()
                .id(product.getId())
                .name(product.getName())
                .type(product.getType())
                .price(product.getPrice())
                .creations(creationsDto)
                .build();
    }

    public static Product toProduct(ProductDto productDto, CreationRepository creationRepository, ProductRepository productRepository) {
        Set<CreationHasProducts> creations = new HashSet<>();
        for (CreationHasProductsDto creationHasProductsDto : productDto.getCreations()) {
            creations.add(
                    CreationHasProductMapper.toCreationHasProducts(creationHasProductsDto, creationRepository, productRepository)
            );
        }

        return Product.builder()
                .id(productDto.getId())
                .name(productDto.getName())
                .type(productDto.getType())
                .creations(creations)
                .price(productDto.getPrice())
                .build();
    }
}
