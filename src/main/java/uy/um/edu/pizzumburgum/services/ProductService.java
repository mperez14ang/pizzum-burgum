package uy.um.edu.pizzumburgum.services;


import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import uy.um.edu.pizzumburgum.dto.shared.CreationHasProductsDto;
import uy.um.edu.pizzumburgum.dto.shared.ProductDto;
import uy.um.edu.pizzumburgum.entities.CreationHasProducts;
import uy.um.edu.pizzumburgum.entities.Product;
import uy.um.edu.pizzumburgum.entities.ProductCategory;
import uy.um.edu.pizzumburgum.entities.ProductType;
import uy.um.edu.pizzumburgum.mapper.ProductMapper;
import uy.um.edu.pizzumburgum.repository.CreationHasProductsRepository;
import uy.um.edu.pizzumburgum.repository.ProductRepository;
import uy.um.edu.pizzumburgum.services.interfaces.ProductServiceInt;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService implements ProductServiceInt {

    private final ProductRepository productRepository;
    private final CreationHasProductsRepository creationHasProductsRepository;

    @Transactional
    @Override
    public ProductDto createProduct(ProductDto productDto) {
        Product product = ProductMapper.toProduct(productDto);


        product.setCreations(new HashSet<>());

        product = productRepository.save(product);
        return ProductMapper.toProductDto(product);
    }

    @Transactional
    @Override
    public ProductDto updateProduct(Long id, ProductDto dto) throws ResponseStatusException {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Producto con id : " + id + " no encontrado"));

        product.setName(dto.getName());
        product.setPrice(dto.getPrice());
        product.setCategory(dto.getProductCategory());

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
    public List<ProductDto> getAllProducts() {
        return productRepository.findAll().stream()
                .map(ProductMapper::toProductDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    @Override
    public List<ProductDto> getProductsByCategory(ProductCategory category) {
        return productRepository.findByCategory(category).stream()
                .map(ProductMapper::toProductDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    @Override
    public List<ProductDto> getProductsByType(ProductType type) {
        return productRepository.findByType(type).stream()
                .map(ProductMapper::toProductDto)
                .collect(Collectors.toList());
    }

    @Transactional
    @Override
    public void deleteProduct(Long id) throws ResponseStatusException {
        if (!productRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Producto con id : " + id + " no encontrado");
        }
        productRepository.deleteById(id);
    }

}