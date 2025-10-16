package uy.um.edu.pizzumburgum.services.interfaces;

import org.springframework.http.ResponseEntity;
import uy.um.edu.pizzumburgum.dto.shared.CreationDto;
import uy.um.edu.pizzumburgum.dto.shared.FavoritesDto;

import java.util.List;

public interface FavoritesServiceInt {
    FavoritesDto createFavorites(FavoritesDto favoritesDto);

    FavoritesDto getFavoritesById(Long id);

    List<FavoritesDto> getFavoritesByClientId(Long id);

    List<FavoritesDto> getFavorites();

    FavoritesDto updateFavorites(Long id, FavoritesDto favoritesDto);

    ResponseEntity<String> deleteFavorite(Long id);
}
