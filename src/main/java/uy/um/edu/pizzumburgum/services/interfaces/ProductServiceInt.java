package uy.um.edu.pizzumburgum.services.interfaces;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import uy.um.edu.pizzumburgum.dto.shared.ProductDto;
import uy.um.edu.pizzumburgum.entities.ProductCategory;
import uy.um.edu.pizzumburgum.entities.ProductType;

import java.util.List;

public interface ProductServiceInt {
    ProductDto createProduct(ProductDto productDto) throws ResponseStatusException;

    ProductDto updateProduct(Long id, ProductDto productDto) throws ResponseStatusException;

    ProductDto getProductById(Long id) throws ResponseStatusException;

    List<ProductDto> getAllProducts();

    List<ProductDto> getProductsByCategory(ProductCategory category);

    List<ProductDto> getProductsByType(ProductType type);

    void deleteProduct(Long id) throws ResponseStatusException;
}
