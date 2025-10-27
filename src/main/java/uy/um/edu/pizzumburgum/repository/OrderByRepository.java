package uy.um.edu.pizzumburgum.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import uy.um.edu.pizzumburgum.entities.OrderBy;
import uy.um.edu.pizzumburgum.entities.OrderState;

import java.util.Optional;

public interface OrderByRepository extends JpaRepository<OrderBy,Long> {
        // Buscar carrito activo (UNPAID) de un cliente
        @Query("SELECT o FROM OrderBy o WHERE o.client.email = :clientEmail AND o.state = :state")
        Optional<OrderBy> findByClientEmailAndState(String clientEmail, OrderState state);

}
