package uy.um.edu.pizzumburgum.mapper;

import uy.um.edu.pizzumburgum.dto.shared.CreationDto;
import uy.um.edu.pizzumburgum.dto.shared.FavoritesDto;
import uy.um.edu.pizzumburgum.entities.Creation;
import uy.um.edu.pizzumburgum.entities.Favorites;

import java.util.HashSet;
import java.util.Set;

public class FavoritesMapper {
    public static Favorites toFavorites(FavoritesDto favoritesDto) {

        return Favorites.builder()
                .id(favoritesDto.getId())
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
