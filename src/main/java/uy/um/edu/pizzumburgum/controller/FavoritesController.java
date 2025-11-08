package uy.um.edu.pizzumburgum.controller;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import uy.um.edu.pizzumburgum.dto.request.FavoritesRequest;
import uy.um.edu.pizzumburgum.dto.response.FavoritesResponse;
import uy.um.edu.pizzumburgum.services.AuthService;
import uy.um.edu.pizzumburgum.services.FavoritesService;

import java.util.List;

@RestController
@RequestMapping("/api/favorites")
@RequiredArgsConstructor
public class FavoritesController {

    private final FavoritesService favoritesService;

    private final AuthService authService;

    /**
     * Crear un nuevo favorito
     * POST /api/favorites
     */
    @PostMapping
    public ResponseEntity<FavoritesResponse> createFavorite(@RequestBody FavoritesRequest favoritesDto, HttpServletRequest httpServletRequest) {
        String clientEmail = authService.getUserEmail(httpServletRequest);
        FavoritesResponse created = favoritesService.createFavorites(favoritesDto, clientEmail);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /**
     * Obtener todos los favoritos (solo ADMIN)
     * GET /api/favorites
     */
    @GetMapping
    public ResponseEntity<List<FavoritesResponse>> getAllFavorites() {
        return ResponseEntity.ok(favoritesService.getFavorites());
    }

    /**
     * Obtener un favorito por ID
     * GET /api/favorites/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<FavoritesResponse> getFavoriteById(@PathVariable Long id) {
        return ResponseEntity.ok(favoritesService.getFavoritesById(id));
    }

    /**
     * Obtener favoritos del usuario autenticado
     * GET /api/favorites/my
     */
    @GetMapping("/my")
    public List<FavoritesResponse> getMyFavorites(HttpServletRequest request) {
        String userEmail = authService.getUserEmail(request);
        return favoritesService.getFavoritesByClientEmail(userEmail);
    }

    /**
     * Actualizar un favorito
     * PUT /api/favorites/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<FavoritesResponse> updateFavorite(
            @PathVariable Long id,
            @RequestBody FavoritesRequest favoritesDto) {
        return ResponseEntity.ok(favoritesService.updateFavorites(id, favoritesDto));
    }

    /**
     * Eliminar un favorito
     * DELETE /api/favorites/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteFavorite(@PathVariable Long id, HttpServletRequest request) {
        String userEmail = authService.getUserEmail(request);
        return favoritesService.deleteFavorite(id, userEmail);
    }
}
