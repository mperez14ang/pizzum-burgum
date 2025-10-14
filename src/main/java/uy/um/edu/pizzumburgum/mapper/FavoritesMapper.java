package uy.um.edu.pizzumburgum.mapper;

import uy.um.edu.pizzumburgum.dto.CreationDto;
import uy.um.edu.pizzumburgum.dto.FavoritesDto;
import uy.um.edu.pizzumburgum.entities.Client;
import uy.um.edu.pizzumburgum.entities.Creation;
import uy.um.edu.pizzumburgum.entities.Favorites;
import uy.um.edu.pizzumburgum.repository.ClientRepository;

import java.util.HashSet;
import java.util.Set;

public class FavoritesMapper {
    public static Favorites toFavorites(FavoritesDto favoritesDto, ClientRepository clientRepository) {

        // Buscar cliente
        Client client = null;
        if (favoritesDto.getClientEmail() != null) {
            client = clientRepository.findById(favoritesDto.getClientEmail())
                    .orElseThrow(() -> new RuntimeException("No se encontro el cliente de favoritos"));
        }

        // Pasar de creationDto a creation
        Set<Creation> creations = new HashSet<>();
        for (CreationDto creationDto : favoritesDto.getCreations()){
            creations.add(
                    CreationMapper.toCreation(creationDto)
            );
        }

        return Favorites.builder()
                .id(favoritesDto.getId())
                .client(client)
                .creations(creations)
                .dateCreated(favoritesDto.getCreatedAt())
                .build();
    }

    public static FavoritesDto toFavoritesDto(Favorites favorites) {
        Set<CreationDto> creationsDto = new HashSet<>();
        for (Creation creation : favorites.getCreations()){
            creationsDto.add(
                    CreationMapper.toCreationDto(creation)
            );
        }

        return FavoritesDto.builder()
                .id(favorites.getId())
                .clientEmail(favorites.getClient().getEmail())
                .createdAt(favorites.getDateCreated())
                .creations(creationsDto)
                .build();
    }
}
