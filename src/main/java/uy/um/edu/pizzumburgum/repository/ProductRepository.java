package uy.um.edu.pizzumburgum.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import uy.um.edu.pizzumburgum.entities.Product;
import uy.um.edu.pizzumburgum.entities.ProductCategory;
import uy.um.edu.pizzumburgum.entities.ProductType;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product,Long> {
    List<Product> findByCategory(ProductCategory category);

    List<Product> findByType(ProductType type);
}
