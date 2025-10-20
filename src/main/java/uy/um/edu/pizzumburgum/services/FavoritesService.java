package uy.um.edu.pizzumburgum.services;


import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import uy.um.edu.pizzumburgum.dto.shared.CreationDto;
import uy.um.edu.pizzumburgum.dto.shared.CreationHasProductsDto;
import uy.um.edu.pizzumburgum.dto.shared.FavoritesDto;
import uy.um.edu.pizzumburgum.entities.*;
import uy.um.edu.pizzumburgum.mapper.FavoritesMapper;
import uy.um.edu.pizzumburgum.repository.ClientRepository;
import uy.um.edu.pizzumburgum.repository.CreationHasProductsRepository;
import uy.um.edu.pizzumburgum.repository.CreationRepository;
import uy.um.edu.pizzumburgum.repository.FavoritesRepository;
import uy.um.edu.pizzumburgum.repository.ProductRepository;
import uy.um.edu.pizzumburgum.services.interfaces.FavoritesServiceInt;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class FavoritesService implements FavoritesServiceInt {
    private final ClientRepository clientRepository;
    private final FavoritesRepository favoritesRepository;
    private final CreationRepository creationRepository;
    private final ProductRepository productRepository;
    private final CreationHasProductsRepository creationHasProductsRepository;

    @Transactional
    @Override
    public FavoritesDto createFavorites(FavoritesDto favoritesDto) {
        Favorites favorites = FavoritesMapper.toFavorites(favoritesDto);
        // Buscar cliente
        Client client = null;
        if (favoritesDto.getClientEmail() != null) {
            client = clientRepository.findById(favoritesDto.getClientEmail())
                    .orElseThrow(() -> new RuntimeException("No se encontró el cliente de favoritos"));
        }

        // Pasar de creationDto a creation
        Set<Creation> creations = new HashSet<>();
        for (CreationDto creationDto : favoritesDto.getCreations()){
            Creation creation;

            // Si la creación tiene ID, buscarla; si no, crear una nueva
            if (creationDto.getId() != null) {
                creation = creationRepository.findById(creationDto.getId())
                        .orElseThrow(() -> new RuntimeException("No se encontró la creación de favoritos"));
            } else {
                // Crear nueva creación
                creation = Creation.builder()
                        .name(creationDto.getName())
                        .type(creationDto.getType())
                        .price(creationDto.getPrice())
                        .build();

                // Guardar la creación para obtener su ID
                creation = creationRepository.save(creation);

                // Crear las relaciones con productos
                if (creationDto.getProducts() != null && !creationDto.getProducts().isEmpty()) {
                    Set<CreationHasProducts> creationProducts = new HashSet<>();
                    for (CreationHasProductsDto productDto : creationDto.getProducts()) {
                        // Buscar el producto por ID
                        Product product = productRepository.findById(productDto.getProduct())
                                .orElseThrow(() -> new RuntimeException("Producto no encontrado: " + productDto.getProduct()));

                        // Crear la relación
                        CreationHasProducts creationHasProduct = CreationHasProducts.builder()
                                .creation(creation)
                                .product(product)
                                .quantity(productDto.getQuantity())
                                .build();

                        creationProducts.add(creationHasProduct);
                        creationHasProductsRepository.save(creationHasProduct);
                    }
                    creation.setProducts(creationProducts);
                }
            }

            creations.add(creation);
        }

        favorites.setClient(client);
        favorites.setCreations(creations);

        favoritesRepository.save(favorites);
        return FavoritesMapper.toFavoritesDto(favorites);

    }

    @Override
    public FavoritesDto getFavoritesById(Long id) {
        Favorites favorites = favoritesRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Favorito no encontrado con id: " + id));
        return FavoritesMapper.toFavoritesDto(favorites);
    }

    @Override
    public List<FavoritesDto> getFavoritesByClientId(Long id) {
        // Buscar cliente por email
        Client client = clientRepository.findById(String.valueOf(id))
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));

        // Obtener favoritos del cliente
        return client.getFavorites().stream()
                .map(FavoritesMapper::toFavoritesDto)
                .toList();
    }

    @Override
    public List<FavoritesDto> getFavoritesByClientEmail(String email) {
        // Buscar cliente por email
        Client client = clientRepository.findById(email)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));

        // Obtener favoritos del cliente
        return client.getFavorites().stream()
                .map(FavoritesMapper::toFavoritesDto)
                .toList();
    }

    @Override
    public List<FavoritesDto> getFavorites() {
        return favoritesRepository.findAll().stream()
                .map(FavoritesMapper::toFavoritesDto)
                .toList();
    }

    @Transactional
    @Override
    public FavoritesDto updateFavorites(Long id, FavoritesDto favoritesDto) {
        Favorites favorites = favoritesRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Favorito no encontrado con id: " + id));

        // Actualizar creaciones
        if (favoritesDto.getCreations() != null) {
            Set<Creation> creations = new HashSet<>();
            for (CreationDto creationDto : favoritesDto.getCreations()) {
                Creation creation = creationRepository.findById(creationDto.getId())
                        .orElseThrow(() -> new RuntimeException("Creación no encontrada"));
                creations.add(creation);
            }
            favorites.setCreations(creations);
        }

        favoritesRepository.save(favorites);
        return FavoritesMapper.toFavoritesDto(favorites);
    }

    @Transactional
    @Override
    public ResponseEntity<String> deleteFavorite(Long id) {
        if (!favoritesRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        favoritesRepository.deleteById(id);
        return ResponseEntity.ok("Favorito eliminado exitosamente");
    }
}
