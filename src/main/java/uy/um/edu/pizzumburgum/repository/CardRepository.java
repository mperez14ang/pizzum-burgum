package uy.um.edu.pizzumburgum.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import uy.um.edu.pizzumburgum.entities.Card;

public interface CardRepository extends JpaRepository<Card,Long> {
    Card findByStripeId(String stripeId);

    // Encuentra una tarjeta activa
    Card findByClientEmailAndActiveTrueAndDeletedFalse(String clientEmail);

    // Encuentra una tarjeta por los últimos 4 dígitos (extraídos del número completo)
    Card findFirstByLast4DigitsAndDeletedFalse(String last4Digits);
}
