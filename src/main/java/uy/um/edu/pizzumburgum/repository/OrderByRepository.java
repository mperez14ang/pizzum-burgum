package uy.um.edu.pizzumburgum.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import uy.um.edu.pizzumburgum.entities.OrderBy;
import uy.um.edu.pizzumburgum.entities.OrderState;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface OrderByRepository extends JpaRepository<OrderBy,Long> {
    // Buscar carrito activo (UNPAID) de un cliente
    Optional<OrderBy> findFirstByClientEmailAndState(String clientEmail, OrderState state);

    // Buscar ordenes por rango de fechas
    @Query("SELECT o FROM OrderBy o WHERE CAST(o.dateCreated AS date) BETWEEN :startDate AND :endDate")
    List<OrderBy> findByCreatedAtBetween(@Param("startDate") LocalDate startDate,
                                          @Param("endDate") LocalDate endDate);
    @Query("SELECT o FROM OrderBy o WHERE CAST(o.dateCreated AS date) = :date " +
            "AND o.state != 'UNPAID' AND o.state != 'CANCELLED'")
    List<OrderBy> findByCreatedAtDateExcludingUnpaidAndCancelled(@Param("date") LocalDate date);

    @Query("SELECT o FROM OrderBy o WHERE CAST(o.dateCreated AS date) BETWEEN :startDate AND :endDate " +
            "AND o.state != 'UNPAID' AND o.state != 'CANCELLED'")
    List<OrderBy> findByCreatedAtBetweenExcludingUnpaidAndCancelled(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);
    // Buscar ordenes de un día específico
    @Query("SELECT o FROM OrderBy o WHERE CAST(o.dateCreated AS date) = :date")
    List<OrderBy> findByCreatedAtDate(@Param("date") LocalDate date);

    @Query("SELECT o FROM OrderBy o WHERE o.client.email = :clientEmail")
    List<OrderBy> findByClientEmail(@Param("clientEmail") String clientEmail);

}
