package uy.um.edu.pizzumburgum.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import uy.um.edu.pizzumburgum.entities.CreationHasProducts;

public interface CreationHasProductsRepository extends JpaRepository<CreationHasProducts,Long> {
}
