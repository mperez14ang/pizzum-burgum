package uy.um.edu.pizzumburgum.mapper;

import uy.um.edu.pizzumburgum.dto.shared.ProductDto;
import uy.um.edu.pizzumburgum.entities.Product;

public class ProductMapper {

    public static ProductDto toProductDto(Product product) {
        return ProductDto.builder()
                .id(product.getId())
                .name(product.getName())
                .type(product.getType())
                .price(product.getPrice())
                .category(product.getCategory())
                .available(product.getAvailable())
                .deleted(product.getDeleted())
                .image(product.getImage())
                .build();
    }

    public static Product toProduct(ProductDto productDto) {
        return Product.builder()
                .id(productDto.getId())
                .name(productDto.getName())
                .type(productDto.getType())
                .price(productDto.getPrice())
                .category(productDto.getCategory())
                .available(productDto.getAvailable() != null ? productDto.getAvailable() : true)
                .deleted(productDto.getDeleted() != null ? productDto.getDeleted() : false)
                .image(productDto.getImage())
                .build();
    }
}