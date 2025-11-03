package uy.um.edu.pizzumburgum.services;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import uy.um.edu.pizzumburgum.dto.request.CreationRequest;
import uy.um.edu.pizzumburgum.dto.response.CreationResponse;
import uy.um.edu.pizzumburgum.entities.*;
import uy.um.edu.pizzumburgum.mapper.CreationHasProductMapper;
import uy.um.edu.pizzumburgum.mapper.CreationMapper;
import uy.um.edu.pizzumburgum.repository.CreationRepository;
import uy.um.edu.pizzumburgum.repository.OrderByRepository;
import uy.um.edu.pizzumburgum.repository.ProductRepository;
import uy.um.edu.pizzumburgum.services.interfaces.CreationServiceInt;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CreationService implements CreationServiceInt {
    private final CreationRepository creationRepository;
    private final ProductRepository productRepository;

    @Transactional
    @Override
    public CreationResponse createCreation(CreationRequest creationDto) {
        Logger log = LoggerFactory.getLogger(CreationService.class);
        log.info("📥 Creando creation: {}", creationDto.getName());
        log.info("   Productos recibidos: {}", creationDto.getProducts() != null ? creationDto.getProducts().size() : 0);

        // Convertir a creation
        Creation creation = CreationMapper.toCreation(creationDto);

        // Convertir creationsHasProductsDto a creationsHasProducts
        Set<CreationHasProducts> creationsHasProducts = new HashSet<>();
        List<Product> products = productRepository.findAll();
        if (creationDto.getProducts() != null) {
            log.info("   Mapeando productos...");
            creationsHasProducts = creationDto.getProducts().stream()
                    .map(c -> {
                        CreationHasProducts creationHasProducts1 = CreationHasProductMapper.toCreationHasProducts(c);

                        Long productId = c.getProductId();
                        Product product = products.stream().filter(p -> p.getId().equals(productId)).findFirst()
                                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No se encontro un producto con id " + productId));

                        creationHasProducts1.setProduct(product);
                        creationHasProducts1.setCreation(creation);
                        log.info("      - Producto ID {}: {} - Cantidad: {} - Precio unitario: {}",
                                productId, product.getName(), creationHasProducts1.getQuantity(), product.getPrice());
                        return creationHasProducts1;
                    }).collect(Collectors.toSet());
            log.info("   ⚠️  Set resultante tiene {} elementos (deberían ser {})",
                    creationsHasProducts.size(),
                    creationDto.getProducts().size());
        }


        creation.setProducts(creationsHasProducts);

        // Calcular el precio real basándose en los productos
        log.info("   Calculando precio...");
        BigDecimal calculatedPrice = creationsHasProducts.stream()
                .map(chp -> {
                    BigDecimal productPrice = chp.getProduct().getPrice();
                    int quantity = chp.getQuantity();
                    BigDecimal subtotal = productPrice.multiply(BigDecimal.valueOf(quantity));
                    log.info("      {} x {} = {}", chp.getProduct().getName(), quantity, subtotal);
                    return subtotal;
                })
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        creation.setPrice(calculatedPrice.floatValue());
        log.info("💰 Precio total calculado: {} (basado en {} productos)", calculatedPrice, creationsHasProducts.size());

        creationRepository.save(creation);

        log.info("✅ Creation guardada con {} productos y precio {}", creation.getProducts().size(), calculatedPrice);

        return CreationMapper.toCreationDto(creation);
    }

    @Override
    public CreationResponse getCreationById(Long id) {
        Creation creation = creationRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No se encontro una creacion con id " + id));
        return CreationMapper.toCreationDto(creation);
    }

    @Override
    public List<CreationResponse> getCreations() {
        return creationRepository.findAll().stream()
                .map(CreationMapper::toCreationDto)
                .toList();
    }

    @Override
    public CreationResponse updateCreation(Long id, CreationRequest creationDto) {
        return null;
    }

    @Override
    public ResponseEntity<String> deleteCreation(Long id) {
        if (!creationRepository.existsById(id)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "No se encontro la creacion con id : " + id);
        }

        creationRepository.deleteById(id);

        return ResponseEntity.ok("La creacion " + id + " ha sido eliminada.");
    }
}
