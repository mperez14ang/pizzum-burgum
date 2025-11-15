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
        this.checkCompatibility(productDto.getType(), productDto.getCategory());

        Product product = ProductMapper.toProduct(productDto);

        product.setCreations(new HashSet<>());

        product = productRepository.save(product);

        return ProductMapper.toProductDto(product);
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
        product.setAvailable(false);
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
    public ProductDto updateProduct(Long id, ProductDto productDto) throws ResponseStatusException {
        System.out.println("Updating Product " + id + " " + productDto.getName());
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Producto con id : " + id + " no encontrado"));

        String name = productDto.getName();
        ProductType type = productDto.getType();
        ProductCategory category = productDto.getCategory();
        Boolean available = productDto.getAvailable();
        BigDecimal price = productDto.getPrice();
        String urlImage = productDto.getImage();

        this.checkCompatibility(type, category);

        if (name != null) product.setName(name);
        if (price != null) product.setPrice(price);
        if (type != null) product.setType(type);
        if (category != null) product.setCategory(category);
        if (available != null && product.getDeleted() == false) product.setAvailable(available);
        if (urlImage != null) product.setImage(urlImage);

        product = productRepository.save(product);
        return ProductMapper.toProductDto(product);
    }

    private void checkCompatibility(ProductType type, ProductCategory category) throws ResponseStatusException {
        // Validar que el tipo sea compatible con la categoría
        if (type != null &&
                category != null &&
                type.getCategory() != category) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "El tipo '" + type + "' no es compatible con la categoría '" + category + "'"
            );
        }
    }

}