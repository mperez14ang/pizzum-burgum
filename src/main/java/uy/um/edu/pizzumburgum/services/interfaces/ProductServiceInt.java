package uy.um.edu.pizzumburgum.services.interfaces;

import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import uy.um.edu.pizzumburgum.dto.shared.ProductDto;
import uy.um.edu.pizzumburgum.entities.ProductCategory;
import uy.um.edu.pizzumburgum.entities.ProductType;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public interface ProductServiceInt {
    ProductDto createProduct(ProductDto productDto) throws ResponseStatusException;

    ProductDto getProductById(Long id) throws ResponseStatusException;

    @Transactional(readOnly = true)
    List<ProductDto> getFilteredProducts(ProductType type, ProductCategory category, Boolean available, Boolean deleted);

    List<ProductDto> getAllProducts();

    ResponseEntity<Map<String, Object>> deleteProduct(Long id) throws ResponseStatusException;

    @Transactional
    ProductDto updateProduct(Long id, ProductDto dto) throws ResponseStatusException;
}
