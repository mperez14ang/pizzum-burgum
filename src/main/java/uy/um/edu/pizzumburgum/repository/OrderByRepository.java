package uy.um.edu.pizzumburgum.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import uy.um.edu.pizzumburgum.entities.OrderBy;
import uy.um.edu.pizzumburgum.entities.OrderState;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface OrderByRepository extends JpaRepository<OrderBy,Long> {
        // Buscar carrito activo (UNPAID) de un cliente
        @Query("SELECT o FROM OrderBy o WHERE o.client.email = :clientEmail AND o.state = :state")
        Optional<OrderBy> findByClientEmailAndState(String clientEmail, OrderState state);

        // Buscar ordenes por rango de fechas
        @Query("SELECT o FROM OrderBy o WHERE o.createdAt >= :startDate AND o.createdAt < :endDate")
        List<OrderBy> findByCreatedAtBetween(@Param("startDate") LocalDateTime startDate,
                                              @Param("endDate") LocalDateTime endDate);

        // Buscar ordenes de un día específico
        @Query("SELECT o FROM OrderBy o WHERE DATE(o.createdAt) = DATE(:date)")
        List<OrderBy> findByCreatedAtDate(@Param("date") LocalDateTime date);
}
