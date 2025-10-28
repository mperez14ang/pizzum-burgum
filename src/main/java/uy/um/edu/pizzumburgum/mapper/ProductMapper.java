package uy.um.edu.pizzumburgum.mapper;

import uy.um.edu.pizzumburgum.dto.shared.ProductDto;
import uy.um.edu.pizzumburgum.entities.Product;

public class ProductMapper {

    public static ProductDto toProductDto(Product product) {
        return ProductDto.builder()
                .id(product.getId())
                .name(product.getName())
                .productType(product.getType())
                .price(product.getPrice())
                .productCategory(product.getCategory())
                .available(product.getAvailable())
                .deleted(product.getDeleted())
                .build();
    }

    public static Product toProduct(ProductDto productDto) {
        return Product.builder()
                .id(productDto.getId())
                .name(productDto.getName())
                .type(productDto.getProductType())
                .price(productDto.getPrice())
                .category(productDto.getProductCategory())
                .available(productDto.getAvailable() != null ? productDto.getAvailable() : true)
                .deleted(productDto.getDeleted() != null ? productDto.getDeleted() : false)
                .build();
    }
}