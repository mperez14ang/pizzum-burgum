package uy.um.edu.pizzumburgum.services;


import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import uy.um.edu.pizzumburgum.dto.shared.CreationDto;
import uy.um.edu.pizzumburgum.dto.shared.FavoritesDto;
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
    private final ClientRepository clientRepository;
    private final FavoritesRepository favoritesRepository;
    private final CreationRepository creationRepository;

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
            Creation creation = creationRepository.findById(creationDto.getId())
                            .orElseThrow(() -> new RuntimeException("No se encontró el creacion de favoritos"));
            creations.add(creation);
        }

        favorites.setClient(client);
        favorites.setCreations(creations);

        favoritesRepository.save(favorites);
        return FavoritesMapper.toFavoritesDto(favorites);

    }

    @Override
    public FavoritesDto getFavoritesById(Long id) {
        return null;
    }

    @Override
    public List<FavoritesDto> getFavoritesByClientId(Long id) {
        return List.of();
    }

    @Override
    public List<FavoritesDto> getFavorites() {
        return List.of();
    }

    @Override
    public FavoritesDto updateFavorites(Long id, FavoritesDto favoritesDto) {
        return null;
    }

    @Override
    public ResponseEntity<String> deleteFavorite(Long id) {
        return null;
    }
}
