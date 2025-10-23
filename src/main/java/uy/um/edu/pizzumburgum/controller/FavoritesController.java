package uy.um.edu.pizzumburgum.controller;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import uy.um.edu.pizzumburgum.dto.response.TokenResponse;
import uy.um.edu.pizzumburgum.dto.shared.FavoritesDto;
import uy.um.edu.pizzumburgum.services.AuthService;
import uy.um.edu.pizzumburgum.services.FavoritesService;

import java.util.List;

@RestController
@RequestMapping("/api/favorites")
@RequiredArgsConstructor
public class FavoritesController {

    Logger log = LoggerFactory.getLogger(FavoritesController.class);

    private final FavoritesService favoritesService;

    private final AuthService authService;

    /**
     * Crear un nuevo favorito
     * POST /api/favorites
     */
    @PostMapping
    public ResponseEntity<FavoritesDto> createFavorite(@RequestBody FavoritesDto favoritesDto) {
        FavoritesDto created = favoritesService.createFavorites(favoritesDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /**
     * Obtener todos los favoritos (solo ADMIN)
     * GET /api/favorites
     */
    @GetMapping
    public ResponseEntity<List<FavoritesDto>> getAllFavorites() {
        return ResponseEntity.ok(favoritesService.getFavorites());
    }

    /**
     * Obtener un favorito por ID
     * GET /api/favorites/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<FavoritesDto> getFavoriteById(@PathVariable Long id) {
        return ResponseEntity.ok(favoritesService.getFavoritesById(id));
    }

    /**
     * Obtener favoritos de un cliente específico
     * GET /api/favorites/client/{clientId}
     */
    @GetMapping("/client/{clientId}")
    public ResponseEntity<List<FavoritesDto>> getFavoritesByClient(@PathVariable Long clientId) {
        return ResponseEntity.ok(favoritesService.getFavoritesByClientId(clientId));
    }

    /**
     * Obtener favoritos del usuario autenticado
     * GET /api/favorites/my
     */
    @GetMapping("/my")
    public List<FavoritesDto> getMyFavorites(HttpServletRequest request) {
        log.info("GET MY FAVORITES");
        TokenResponse tokenResponse = authService.verifyToken(request);
        if (!tokenResponse.isVerified()){
            log.error("Token invalido");
            return null;
        }

        String userEmail = authService.getTokenUsername(authService.getToken(request));
        return favoritesService.getFavoritesByClientEmail(userEmail);
    }

    /**
     * Actualizar un favorito
     * PUT /api/favorites/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<FavoritesDto> updateFavorite(
            @PathVariable Long id,
            @RequestBody FavoritesDto favoritesDto) {
        return ResponseEntity.ok(favoritesService.updateFavorites(id, favoritesDto));
    }

    /**
     * Eliminar un favorito
     * DELETE /api/favorites/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteFavorite(@PathVariable Long id) {
        return favoritesService.deleteFavorite(id);
    }
}
