package uy.um.edu.pizzumburgum.services;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import uy.um.edu.pizzumburgum.dto.request.FavoritesRequest;
import uy.um.edu.pizzumburgum.dto.response.FavoritesResponse;
import uy.um.edu.pizzumburgum.entities.Client;
import uy.um.edu.pizzumburgum.entities.Creation;
import uy.um.edu.pizzumburgum.entities.Favorites;
import uy.um.edu.pizzumburgum.mapper.FavoritesMapper;
import uy.um.edu.pizzumburgum.repository.ClientRepository;
import uy.um.edu.pizzumburgum.repository.CreationRepository;
import uy.um.edu.pizzumburgum.repository.FavoritesRepository;
import uy.um.edu.pizzumburgum.services.interfaces.FavoritesServiceInt;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class FavoritesService implements FavoritesServiceInt {
    private static final Logger log = LoggerFactory.getLogger(FavoritesService.class);

    private final ClientRepository clientRepository;
    private final FavoritesRepository favoritesRepository;
    private final CreationRepository creationRepository;

    @Transactional
    @Override
    public FavoritesResponse createFavorites(FavoritesRequest favoritesDto) {
        Favorites favorites = FavoritesMapper.toFavorites(favoritesDto);
        // Buscar cliente
        Client client = clientRepository.findById(favoritesDto.getClientEmail())
                .orElseThrow(() -> new RuntimeException("No se encontró el cliente de favoritos"));


        // Pasar de creationDto a creation
        Set<Creation> creations = new HashSet<>();
        for (Long creationId : favoritesDto.getCreationsIds()){
            Creation creation = creationRepository.findById(creationId)
                    .orElseThrow(() -> new RuntimeException("No se encontró la creacion"));
            creations.add(creation);

        }

        favorites.setCreations(creations);
        favorites.setClient(client);

        // Agregar a cliente
        assert client != null;
        client.getFavorites().add(favorites);

        favoritesRepository.save(favorites);
        return FavoritesMapper.toFavoritesDto(favorites);

    }

    @Override
    public FavoritesResponse getFavoritesById(Long id) {
        Favorites favorites = favoritesRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Favorito no encontrado con id: " + id));
        return FavoritesMapper.toFavoritesDto(favorites);
    }

    @Override
    public List<FavoritesResponse> getFavoritesByClientId(Long id) {
        // Buscar cliente por email
        Client client = clientRepository.findById(String.valueOf(id))
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));

        // Obtener favoritos del cliente
        return client.getFavorites().stream()
                .map(FavoritesMapper::toFavoritesDto)
                .toList();
    }

    @Override
    public List<FavoritesResponse> getFavoritesByClientEmail(String email) {
        // Buscar cliente por email
        Client client = clientRepository.findById(email).orElse(null);

        if (client == null) {
            return List.of();
        }

        // Si el cliente no existe o no tiene favoritos, devolver lista vacía
        if (client.getFavorites() == null || client.getFavorites().isEmpty()) {
            return List.of(); // Lista vacía inmutable
        }

        // Obtener favoritos del cliente
        return client.getFavorites().stream()
                .map(FavoritesMapper::toFavoritesDto)
                .toList();
    }

    @Override
    public List<FavoritesResponse> getFavorites() {
        return favoritesRepository.findAll().stream()
                .map(FavoritesMapper::toFavoritesDto)
                .toList();
    }

    @Transactional
    @Override
    public FavoritesResponse updateFavorites(Long id, FavoritesRequest favoritesDto) {
        Favorites favorites = favoritesRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Favorito no encontrado con id: " + id));

        // Actualizar creaciones
        if (favoritesDto.getCreationsIds() != null) {
            Set<Creation> creations = new HashSet<>();
            for (Long creationId : favoritesDto.getCreationsIds()) {
                Creation creation = creationRepository.findById(creationId)
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
