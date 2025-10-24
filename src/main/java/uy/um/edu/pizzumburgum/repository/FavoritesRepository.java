package uy.um.edu.pizzumburgum.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import uy.um.edu.pizzumburgum.entities.Favorites;

import java.util.List;

public interface FavoritesRepository extends JpaRepository<Favorites,Long> {

    @Query("SELECT f FROM Favorites f WHERE f.client.email = :email")
    List<Favorites> findByClientEmail(@Param("email") String email);
}
