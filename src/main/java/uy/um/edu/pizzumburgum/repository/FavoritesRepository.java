package uy.um.edu.pizzumburgum.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import uy.um.edu.pizzumburgum.entities.Favorites;

public interface FavoritesRepository extends JpaRepository<Favorites,Long> {
}
