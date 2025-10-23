package uy.um.edu.pizzumburgum.services.interfaces;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import uy.um.edu.pizzumburgum.dto.shared.ProductDto;
import uy.um.edu.pizzumburgum.entities.ProductCategory;
import uy.um.edu.pizzumburgum.entities.ProductType;

import java.math.BigDecimal;
import java.util.List;

public interface ProductServiceInt {
    ProductDto createProduct(ProductDto productDto) throws ResponseStatusException;

    ProductDto getProductById(Long id) throws ResponseStatusException;

    List<ProductDto> getFilteredProducts(ProductType type, ProductCategory category, Boolean avaliable);

    List<ProductDto> getAllProducts();

    void deleteProduct(Long id) throws ResponseStatusException;

    Object updateProduct(Long id, String name, BigDecimal price, ProductType productType, ProductCategory productCategory, Boolean available);

    @Transactional
    ProductDto updateProduct(Long id, ProductDto dto) throws ResponseStatusException;
}
