package uy.um.edu.pizzumburgum.services;


import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uy.um.edu.pizzumburgum.dto.shared.ProductDto;
import uy.um.edu.pizzumburgum.entities.Product;
import uy.um.edu.pizzumburgum.entities.ProductCategory;
import uy.um.edu.pizzumburgum.entities.ProductType;
import uy.um.edu.pizzumburgum.exception.ResourceNotFoundException;
import uy.um.edu.pizzumburgum.mapper.ProductMapper;
import uy.um.edu.pizzumburgum.repository.ProductRepository;
import uy.um.edu.pizzumburgum.repository.CreationRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CreationRepository creationRepository;

    @Transactional
    public ProductDto createProduct(ProductDto dto) {
        Product product = ProductMapper.toProduct(dto, creationRepository, productRepository);
        product = productRepository.save(product);
        return ProductMapper.toProductDto(product);
    }

    @Transactional
    public ProductDto updateProduct(Long id, ProductDto dto) throws ResourceNotFoundException {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        product.setName(dto.getName());
        product.setPrice(dto.getPrice());
        product.setCategory(dto.getProductCategory());

        product = productRepository.save(product);
        return ProductMapper.toProductDto(product);
    }

    @Transactional(readOnly = true)
    public ProductDto getProductById(Long id) throws ResourceNotFoundException {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        return ProductMapper.toProductDto(product);
    }

    @Transactional(readOnly = true)
    public List<ProductDto> getAllProducts() {
        return productRepository.findAll().stream()
                .map(ProductMapper::toProductDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProductDto> getProductsByCategory(ProductCategory category) {
        return productRepository.findByCategory(category).stream()
                .map(ProductMapper::toProductDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProductDto> getProductsByType(ProductType type) {
        return productRepository.findByType(type).stream()
                .map(ProductMapper::toProductDto)
                .collect(Collectors.toList());
    }


    @Transactional
    public void deleteProduct(Long id) throws ResourceNotFoundException {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Product not found with id: " + id);
        }
        productRepository.deleteById(id);
    }

}