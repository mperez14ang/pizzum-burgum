package uy.um.edu.pizzumburgum.services;


import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uy.um.edu.pizzumburgum.dto.shared.CreationDto;
import uy.um.edu.pizzumburgum.dto.shared.FavoritesDto;
import uy.um.edu.pizzumburgum.entities.Client;
import uy.um.edu.pizzumburgum.entities.Creation;
import uy.um.edu.pizzumburgum.entities.Favorites;
import uy.um.edu.pizzumburgum.mapper.CreationMapper;
import uy.um.edu.pizzumburgum.mapper.FavoritesMapper;
import uy.um.edu.pizzumburgum.repository.*;

import java.util.HashSet;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class FavoritesService {
    ClientRepository clientRepository;
    FavoritesRepository favoritesRepository;
    CreationRepository creationRepository;

    @Transactional
    public FavoritesDto createFavorites(FavoritesDto favoritesDto) {
        Favorites favorites = FavoritesMapper.toFavorites(favoritesDto);
        // Buscar cliente
        Client client = null;
        if (favoritesDto.getClientEmail() != null) {
            client = clientRepository.findById(favoritesDto.getClientEmail())
                    .orElseThrow(() -> new RuntimeException("No se encontro el cliente de favoritos"));
        }

        // Pasar de creationDto a creation
        Set<Creation> creations = new HashSet<>();
        for (CreationDto creationDto : favoritesDto.getCreations()){
            Creation creation = creationRepository.findById(creationDto.getId())
                            .orElseThrow(() -> new RuntimeException("No se encontro el creacion de favoritos"));
            creations.add(creation);
        }

        favorites.setClient(client);
        favorites.setCreations(creations);

        favoritesRepository.save(favorites);
        return FavoritesMapper.toFavoritesDto(favorites);

    }
}
