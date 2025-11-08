package uy.um.edu.pizzumburgum.services.interfaces;

import jakarta.transaction.Transactional;
import org.springframework.http.ResponseEntity;
import uy.um.edu.pizzumburgum.dto.request.FavoritesRequest;
import uy.um.edu.pizzumburgum.dto.response.FavoritesResponse;

import java.util.List;

public interface FavoritesServiceInt {

    @Transactional
    FavoritesResponse createFavorites(FavoritesRequest favoritesDto, String clientEmail);

    FavoritesResponse getFavoritesById(Long id);

    List<FavoritesResponse> getFavoritesByClientId(Long id);

    List<FavoritesResponse> getFavoritesByClientEmail(String email);

    List<FavoritesResponse> getFavorites();

    @Transactional
    FavoritesResponse updateFavorites(Long id, FavoritesRequest favoritesDto);

    @Transactional
    ResponseEntity<String> deleteFavorite(Long id, String userEmail);
}
