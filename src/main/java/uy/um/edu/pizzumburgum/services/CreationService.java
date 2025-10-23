package uy.um.edu.pizzumburgum.services;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import uy.um.edu.pizzumburgum.dto.shared.CreationDto;
import uy.um.edu.pizzumburgum.entities.*;
import uy.um.edu.pizzumburgum.mapper.CreationHasProductMapper;
import uy.um.edu.pizzumburgum.mapper.CreationMapper;
import uy.um.edu.pizzumburgum.mapper.OrderHasCreationsMapper;
import uy.um.edu.pizzumburgum.repository.CreationRepository;
import uy.um.edu.pizzumburgum.repository.OrderByRepository;
import uy.um.edu.pizzumburgum.repository.ProductRepository;
import uy.um.edu.pizzumburgum.services.interfaces.CreationServiceInt;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CreationService implements CreationServiceInt {
    private final CreationRepository creationRepository;
    private final ProductRepository productRepository;
    private final OrderByRepository orderByRepository;

    private static final Logger log = LoggerFactory.getLogger(CreationService.class);

    @Transactional
    @Override
    public CreationDto createCreation(CreationDto creationDto) {
        log.info(creationDto.getName());
        log.info(String.valueOf(creationDto.getType()));

        Creation creation = CreationMapper.toCreation(creationDto);

        // Convertir creationsHasProductsDto a creationsHasProducts
        Set<CreationHasProducts> creationsHasProducts = new HashSet<>();
        if (creationDto.getProducts() != null) {
            creationsHasProducts = creationDto.getProducts().stream()
                    .map(c -> {
                        CreationHasProducts creationHasProducts1 = CreationHasProductMapper.toCreationHasProducts(c);

                        Long productId = c.getProductId();
                        log.info(String.valueOf(c.getProductId()));
                        Product product = productRepository.findById(productId)
                                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

                        creationHasProducts1.setProduct(product);
                        return creationHasProducts1;
                    }).collect(Collectors.toSet());
        }


        // Convertir OrderHasCreationsDto a OrderHasCreations
        Set<OrderHasCreations> orderHasCreations = new HashSet<>();
        if  (creationDto.getOrders() != null) {
            orderHasCreations = creationDto.getOrders().stream()
                    .map(c -> {
                        OrderHasCreations orderHasCreations1 = OrderHasCreationsMapper.toOrderHasCreations(c);

                        Long orderId = c.getOrderId();
                        OrderBy orderBy = orderByRepository.findById(orderId)
                                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

                        orderHasCreations1.setOrder(orderBy);
                        return orderHasCreations1;
                    }).collect(Collectors.toSet());
        }


        creation.setOrder(orderHasCreations);
        creation.setProducts(creationsHasProducts);

        creationRepository.save(creation);

        return CreationMapper.toCreationDto(creation);
    }

    @Override
    public CreationDto getCreationById(Long id) {
        return null;
    }

    @Override
    public List<CreationDto> getCreations() {
        return List.of();
    }

    @Override
    public CreationDto updateCreation(Long id, CreationDto creationDto) {
        return null;
    }

    @Override
    public ResponseEntity<String> deleteCreation(Long id) {
        return null;
    }
}
