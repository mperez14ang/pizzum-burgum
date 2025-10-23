package uy.um.edu.pizzumburgum.mapper;

import uy.um.edu.pizzumburgum.dto.request.FavoritesRequest;
import uy.um.edu.pizzumburgum.dto.response.FavoritesResponse;
import uy.um.edu.pizzumburgum.dto.shared.CreationDto;
import uy.um.edu.pizzumburgum.entities.Creation;
import uy.um.edu.pizzumburgum.entities.Favorites;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

public class FavoritesMapper {
    public static Favorites toFavorites(FavoritesRequest favoritesDto) {
        LocalDate currentDate = LocalDate.now();

        return Favorites.builder()
                .dateCreated(currentDate)
                .build();
    }

    public static FavoritesResponse toFavoritesDto(Favorites favorites) {
        Set<CreationDto> creationsIds = new HashSet<>();
        for (Creation creation : favorites.getCreations()){
            creationsIds.add(
                    CreationMapper.toCreationDto(creation)
            );
        }

        return FavoritesResponse.builder()
                .id(favorites.getId())
                .clientEmail(favorites.getClient().getEmail())
                .createdAt(favorites.getDateCreated())
                .creations(creationsIds)
                .build();
    }
}
