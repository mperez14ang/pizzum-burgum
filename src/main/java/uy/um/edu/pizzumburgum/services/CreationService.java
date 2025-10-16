package uy.um.edu.pizzumburgum.services;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import uy.um.edu.pizzumburgum.dto.shared.CreationDto;
import uy.um.edu.pizzumburgum.dto.shared.CreationHasProductsDto;
import uy.um.edu.pizzumburgum.dto.shared.OrderHasCreationsDto;
import uy.um.edu.pizzumburgum.entities.Creation;
import uy.um.edu.pizzumburgum.entities.CreationHasProducts;
import uy.um.edu.pizzumburgum.entities.OrderHasCreations;
import uy.um.edu.pizzumburgum.mapper.CreationMapper;
import uy.um.edu.pizzumburgum.repository.CreationHasProductsRepository;
import uy.um.edu.pizzumburgum.repository.CreationRepository;
import uy.um.edu.pizzumburgum.repository.OrderHasCreationsRepository;

import java.util.HashSet;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class CreationService {
    CreationRepository creationRepository;
    CreationHasProductsRepository creationHasProductsRepository;
    OrderHasCreationsRepository orderHasCreationsRepository;

    @Transactional
    public CreationDto create(CreationDto creationDto) {
        Creation creation = CreationMapper.toCreation(creationDto);

        // Convertir creationsHasProductsDto a creationsHasProducts
        Set<CreationHasProducts> creationsHasProducts = new HashSet<>();
        for (CreationHasProductsDto creationHasProductsDto : creationDto.getProducts()){
            creationsHasProducts.add(
                    creationHasProductsRepository.findById(creationHasProductsDto.getId()).
                            orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "No se encontro la CreationsHasProducts")
                            )
            );
        }

        // Convertir OrderHasCreationsDto a OrderHasCreations
        Set<OrderHasCreations> orderHasCreations = new HashSet<>();
        for (OrderHasCreationsDto orderHasCreationsDto : creationDto.getOrders()){
            orderHasCreations.add(
                    orderHasCreationsRepository.findById(orderHasCreationsDto.getId()).
                            orElseThrow(() -> new ResponseStatusException(
                                    HttpStatus.BAD_REQUEST, "No se encontro orderHasCreations")
                            )
            );
        }

        creation.setOrder(orderHasCreations);
        creation.setProducts(creationsHasProducts);

        creationRepository.save(creation);

        return CreationMapper.toCreationDto(creation);
    }
}
