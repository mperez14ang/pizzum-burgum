package uy.um.edu.pizzumburgum.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import uy.um.edu.pizzumburgum.entities.OrderHasCreations;

public interface OrderHasCreationsRepository extends JpaRepository<OrderHasCreations,Long> {
}
