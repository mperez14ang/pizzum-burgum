package uy.um.edu.pizzumburgum.services;


import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import uy.um.edu.pizzumburgum.dto.shared.ProductDto;
import uy.um.edu.pizzumburgum.entities.Creation;
import uy.um.edu.pizzumburgum.entities.Product;
import uy.um.edu.pizzumburgum.entities.ProductCategory;
import uy.um.edu.pizzumburgum.entities.ProductType;
import uy.um.edu.pizzumburgum.mapper.ProductMapper;
import uy.um.edu.pizzumburgum.repository.ProductRepository;
import uy.um.edu.pizzumburgum.services.interfaces.ProductServiceInt;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService implements ProductServiceInt {

    private final ProductRepository productRepository;

    @Transactional
    @Override
    public ProductDto createProduct(ProductDto productDto) {
        // Validar que el tipo sea compatible con la categoría
        this.checkCompatibility(productDto.getProductType(), productDto.getProductCategory());

        System.out.println("=== CREANDO PRODUCTO ===");
        System.out.println("DTO recibido: " + productDto);

        Product product = ProductMapper.toProduct(productDto);
        System.out.println("Producto mapeado: " + product);

        product.setCreations(new HashSet<>());

        product = productRepository.save(product);
        System.out.println("Producto guardado con ID: " + product.getId());

        ProductDto result = ProductMapper.toProductDto(product);
        System.out.println("DTO retornado: " + result);

        return result;
    }

    @Transactional(readOnly = true)
    @Override
    public ProductDto getProductById(Long id) throws ResponseStatusException {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Producto con id : " + id + " no encontrado"));
        return ProductMapper.toProductDto(product);
    }

    @Transactional(readOnly = true)
    @Override
    public List<ProductDto> getFilteredProducts(ProductType type, ProductCategory category, Boolean available, Boolean deleted) {
        return productRepository.findAll().stream()
                .filter(product -> type == null || product.getType() == type)
                .filter(product -> category == null || product.getCategory() == category)
                .filter(product -> available == null || product.getAvailable() == available)
                .filter(product -> deleted == null || product.getDeleted() == deleted)
                .map(ProductMapper::toProductDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    @Override
    public List<ProductDto> getAllProducts() {
        return productRepository.findAll().stream()
                .map(ProductMapper::toProductDto)
                .collect(Collectors.toList());
    }

    @Transactional
    @Override
    public ResponseEntity<Map<String, Object>> deleteProduct(Long id) throws ResponseStatusException {
        Map<String, Object> message = new HashMap<>();

        Product product = productRepository.findById(id)
                .orElseThrow( () ->
                        new ResponseStatusException(HttpStatus.BAD_REQUEST, "Producto con id : " + id + " no encontrado")
                );

        // Setear eliminate a true
        product.setDeleted(true);

        // Borrar solo si no esta referenciado
        if (product.getCreations().isEmpty()) {
            productRepository.deleteById(id);
            message.put("message", "Producto con id : " + id + " eliminado.");
        }
        else{
            message.put("message", "Producto con id : " + id + " fue marcado como 'deleted'.");
        }
        return ResponseEntity.ok(message);

    }

    @Override
    public ProductDto updateProduct(Long id, String name, BigDecimal price,
                                ProductType productType, ProductCategory productCategory, Boolean available) {

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Producto con id : " + id + " no encontrado"));

        this.checkCompatibility(productType, productCategory);

        if (name != null) product.setName(name);
        if (price != null) product.setPrice(price);
        if (productType != null) product.setType(productType);
        if (productCategory != null) product.setCategory(productCategory);
        if (available != null) product.setAvailable(available);

        product = productRepository.save(product);
        return ProductMapper.toProductDto(product);
    }

    @Transactional
    @Override
    public ProductDto updateProduct(Long id, ProductDto dto) throws ResponseStatusException {
        return this.updateProduct(dto.getId(), dto.getName(), dto.getPrice(), dto.getProductType(), dto.getProductCategory(), dto.getAvailable());
    }

    private void checkCompatibility(ProductType productType, ProductCategory productCategory) throws ResponseStatusException {
        // Validar que el tipo sea compatible con la categoría
        if (productType != null &&
                productCategory != null &&
                productType.getCategory() != productCategory) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "El tipo '" + productType + "' no es compatible con la categoría '" + productCategory + "'"
            );
        }
    }

}