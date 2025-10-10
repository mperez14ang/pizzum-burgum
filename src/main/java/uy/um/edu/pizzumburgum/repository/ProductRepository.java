package uy.um.edu.pizzumburgum.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import uy.um.edu.pizzumburgum.entities.Product;

public interface ProductRepository extends JpaRepository<Product,Long> {
}
